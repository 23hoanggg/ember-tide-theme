#!/usr/bin/env bash
# Ember Tide Light cho GNOME Terminal — áp vào profile mặc định. Sinh tự động từ palette.mjs.
set -euo pipefail
id=$(gsettings get org.gnome.Terminal.ProfilesList default | tr -d "'")
p="org.gnome.Terminal.Legacy.Profile:/org/gnome/terminal/legacy/profiles:/:$id/"
gsettings set "$p" use-theme-colors false
gsettings set "$p" background-color '#FAF7F1'
gsettings set "$p" foreground-color '#373E4C'
gsettings set "$p" cursor-colors-set true
gsettings set "$p" cursor-background-color '#0068A2'
gsettings set "$p" cursor-foreground-color '#FAF7F1'
gsettings set "$p" highlight-colors-set true
gsettings set "$p" highlight-background-color '#D6E6F7'
gsettings set "$p" highlight-foreground-color '#141922'
gsettings set "$p" palette "['#2A313E', '#BF2F4E', '#3E7A1C', '#966200', '#1D63B5', '#8B43AA', '#0F7C77', '#9C968C', '#6D7685', '#D4405C', '#4D8C2A', '#A97500', '#2E78CC', '#A057BF', '#20918B', '#B5AFA6']"
echo "✔ Đã áp Ember Tide Light cho profile GNOME Terminal mặc định"
