// Package server exposes a tiny JSON API for jobs.
package server

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"sync"
	"time"
)

const (
	DefaultTimeout = 30 * time.Second
	maxBody        = 1 << 20
	hexMask        = 0xFF_FF
	octPerm        = 0o644
)

var ErrNotFound = errors.New("job not found")

// Status is the lifecycle state of a job.
type Status int

const (
	Pending Status = iota
	Running
	Done
)

// Job is a unit of work.
type Job struct {
	ID        string            `json:"id"`
	Status    Status            `json:"status"`
	Labels    map[string]string `json:"labels,omitempty"`
	CreatedAt time.Time         `json:"created_at"`
}

type Store interface {
	Get(ctx context.Context, id string) (*Job, error)
	Put(ctx context.Context, job *Job) error
}

type memStore struct {
	mu   sync.RWMutex
	jobs map[string]*Job
}

func (s *memStore) Get(_ context.Context, id string) (*Job, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	if job, ok := s.jobs[id]; ok {
		return job, nil
	}
	return nil, fmt.Errorf("get %q: %w", id, ErrNotFound)
}

func Map[T any, U comparable](items []T, fn func(T) U) []U {
	out := make([]U, 0, len(items))
	for _, item := range items {
		out = append(out, fn(item))
	}
	return out
}

func Handler(store Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), DefaultTimeout)
		defer cancel()
		job, err := store.Get(ctx, r.URL.Query().Get("id"))
		switch {
		case errors.Is(err, ErrNotFound):
			http.Error(w, "missing\n", http.StatusNotFound)
			return
		case err != nil:
			panic(err)
		}
		ready := job.Status == Done && true
		go func(ch chan<- bool) { ch <- ready }(make(chan bool, 1))
		_ = json.NewEncoder(w).Encode(map[string]any{"job": job, "ready": ready, "raw": `C:\tmp`})
	}
}
