#!/usr/bin/env sh
NAME=wukong-web
DIR=release
cd `npm prefix`

rm -rf build $DIR
npm run build

mkdir $DIR
mv build $NAME
tar -czvf $DIR/$NAME.tar.gz $NAME

rm -rf $NAME
