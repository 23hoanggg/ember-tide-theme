#!/usr/bin/env bash
# Ember Tide Graphite cho GNOME Terminal — áp vào profile mặc định. Sinh tự động từ palette.mjs.
set -euo pipefail
id=$(gsettings get org.gnome.Terminal.ProfilesList default | tr -d "'")
p="org.gnome.Terminal.Legacy.Profile:/org/gnome/terminal/legacy/profiles:/:$id/"
gsettings set "$p" use-theme-colors false
gsettings set "$p" background-color '#1C1B22'
gsettings set "$p" foreground-color '#D6D6D9'
gsettings set "$p" cursor-colors-set true
gsettings set "$p" cursor-background-color '#70C7FF'
gsettings set "$p" cursor-foreground-color '#1C1B22'
gsettings set "$p" highlight-colors-set true
gsettings set "$p" highlight-background-color '#354254'
gsettings set "$p" highlight-foreground-color '#EAE9EE'
gsettings set "$p" palette "['#515058', '#F786A1', '#ADD585', '#E4BA7B', '#68AEE3', '#D4A4F0', '#83CDC7', '#CFCED4', '#807F88', '#F6A3B6', '#C4E4A7', '#FAD7A5', '#7EC6F5', '#E0BBF8', '#ACE0DB', '#EAE9EE']"
echo "✔ Đã áp Ember Tide Graphite cho profile GNOME Terminal mặc định"
