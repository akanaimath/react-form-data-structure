#!/bin/sh

git add --all;git commit -m 'patching';npm version patch;npm publish;git push