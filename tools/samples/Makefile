# Makefile for the sample project
SHELL := /bin/bash
.DEFAULT_GOAL := help

NAME     ?= ember
VERSION  := $(shell git describe --tags --always 2>/dev/null)
SRC      := $(wildcard src/*.c)
OBJ      := $(SRC:.c=.o)
CFLAGS   += -O2 -Wall -Wextra -std=c17
LDFLAGS  =
DEBUG    ?= 0

ifeq ($(DEBUG),1)
  CFLAGS += -g -DDEBUG
else ifdef RELEASE
  CFLAGS += -DNDEBUG
endif

export PATH := $(HOME)/.local/bin:$(PATH)

.PHONY: all build test clean help

all: build test ## Build and test

build: $(NAME) ## Compile the binary

$(NAME): $(OBJ)
	$(CC) $(LDFLAGS) -o $@ $^

%.o: %.c include/%.h
	@echo "  CC  $<"
	$(CC) $(CFLAGS) -c $< -o $@

test: build ## Run the test suite
	@for t in tests/*.sh; do \
		bash "$$t" || exit 1; \
	done
	./$(NAME) --version | grep -q "$(VERSION)"

clean: ## Remove build output
	$(RM) $(OBJ) $(NAME)
	-rm -rf dist/

define banner
	@printf '\033[1m%s\033[0m %s\n' "$(1)" "$(VERSION)"
endef

help: ## Show this help
	$(call banner,$(NAME))
	@grep -E '^[a-z]+:.*## ' $(MAKEFILE_LIST) | awk -F ':.*## ' '{printf "  %-10s %s\n", $$1, $$2}'

include $(wildcard *.mk)
$(info building $(NAME) $(VERSION))
