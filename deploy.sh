#!/bin/bash
. /etc/profile
. $HOME/.bash_profile
cd `dirname $0`
svn up
cd build
ant deployjsp
