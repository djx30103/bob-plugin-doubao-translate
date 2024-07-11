#!/bin/bash

version=${1#refs/tags/v}
zip -r -j bob-plugin-doubao-translate-$version.bobplugin src/*

sha256_doubao=$(sha256sum bob-plugin-doubao-translate-$version.bobplugin | cut -d ' ' -f 1)
echo $sha256_doubao

download_link="https://github.com/djx30103/bob-plugin-doubao-translate/releases/download/v$version/bob-plugin-doubao-translate-$version.bobplugin"

new_version="{\"version\": \"$version\", \"desc\": \"None\", \"sha256\": \"$sha256_doubao\", \"url\": \"$download_link\", \"minBobVersion\": \"1.8.0\"}"

json_file='appcast.json'
json_data=$(cat $json_file)

updated_json=$(echo $json_data | jq --argjson new_version "$new_version" '.versions = [$new_version] + .versions')

echo $updated_json > $json_file
mkdir dist
mv *.bobplugin dist
