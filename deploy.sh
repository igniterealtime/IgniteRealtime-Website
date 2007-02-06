#!/bin/bash
. /etc/profile
. $HOME/.bash_profile
cd `dirname $0`
/usr/local/bin/svn up
cd build
ant deployjsp
