#!/usr/bin/env bash
# Ember Tide Neon cho GNOME Terminal — áp vào profile mặc định. Sinh tự động từ palette.mjs.
set -euo pipefail
id=$(gsettings get org.gnome.Terminal.ProfilesList default | tr -d "'")
p="org.gnome.Terminal.Legacy.Profile:/org/gnome/terminal/legacy/profiles:/:$id/"
gsettings set "$p" use-theme-colors false
gsettings set "$p" background-color '#0C0F23'
gsettings set "$p" foreground-color '#D8DCEC'
gsettings set "$p" cursor-colors-set true
gsettings set "$p" cursor-background-color '#5ED0FF'
gsettings set "$p" cursor-foreground-color '#0C0F23'
gsettings set "$p" highlight-colors-set true
gsettings set "$p" highlight-background-color '#1C3872'
gsettings set "$p" highlight-foreground-color '#F2F5FE'
gsettings set "$p" palette "['#424B6B', '#FE6C8F', '#92E466', '#FBC044', '#3BA6F5', '#D780FC', '#2AD7D7', '#CAD0E5', '#757F9F', '#FE98AB', '#ACF688', '#FFDD96', '#72C8FE', '#E4A9FF', '#74EEEE', '#F2F5FE']"
echo "✔ Đã áp Ember Tide Neon cho profile GNOME Terminal mặc định"
