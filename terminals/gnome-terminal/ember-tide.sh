#!/usr/bin/env bash
# Ember Tide cho GNOME Terminal — áp vào profile mặc định. Sinh tự động từ palette.mjs.
set -euo pipefail
id=$(gsettings get org.gnome.Terminal.ProfilesList default | tr -d "'")
p="org.gnome.Terminal.Legacy.Profile:/org/gnome/terminal/legacy/profiles:/:$id/"
gsettings set "$p" use-theme-colors false
gsettings set "$p" background-color '#171D28'
gsettings set "$p" foreground-color '#DCE3EE'
gsettings set "$p" cursor-colors-set true
gsettings set "$p" cursor-background-color '#70C7FF'
gsettings set "$p" cursor-foreground-color '#171D28'
gsettings set "$p" highlight-colors-set true
gsettings set "$p" highlight-background-color '#2A4263'
gsettings set "$p" highlight-foreground-color '#F0F4FA'
gsettings set "$p" palette "['#465166', '#FF7F9F', '#A9D77B', '#E8B96F', '#5CAFEB', '#D7A0F7', '#79CFC8', '#C5D0E0', '#748197', '#FF9DB4', '#C0E69E', '#FFD69A', '#70C7FF', '#E3B8FF', '#A4E2DC', '#F0F4FA']"
echo "✔ Đã áp Ember Tide cho profile GNOME Terminal mặc định"
