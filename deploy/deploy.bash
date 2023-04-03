#!/bin/bash
# simple script to deploy files to s3 and issue cloudfront invalidation using AWS cli
name=`basename "$0"`

function error_exit {
	echo "$name error: $1" >&2
	exit 1
}

function warn {
	echo "$name warning: $1" >&2
}

function usage {
	[ "$1" ] && warn "$1"
	cat >&2 <<EOF
deploy files to s3 bucket
usage:
  $name [options]
options:
  -dryrun: run commands with --dryrun
  -cfg=<file>: use file for cfg instead of "$selfdir/deploy.cfg"
  -nodelete: do not delete obsolete files in _next

EOF
	exit 1
}
function s3_cmd {
	echo "aws s3 $*"
	aws s3 "$@"
}

function cf_cmd {
	echo "aws cloudfront $*"
	if [ -z "$dryrun" ] ; then
		aws cloudfront "$@"
	fi
}


arg="$1"
dryrun=""
selfdir="$(dirname "$(readlink -f "$0")")"
rootdir="$(dirname "$selfdir")"
cfgfile="$selfdir"/deploy.cfg
dodelete="--delete"

while [ ! -z "$arg" ] ; do
	case $arg in
	-dryrun)
		dryrun="--dryrun"
	;;
	-cfg=*)
		cfgfile="${arg#-cfg=}"
	;;
	-nodelete)
		dodelete=""
	;;
	*)
		usage "unknown option $arg"
	;;
	esac
	shift
	arg="$1"
done

if [ -f "$cfgfile" ] ; then
	. "$cfgfile"
else
	warn "missing cfg $cfgfile"
fi
if [ -z "$AUTOBUILD_BUCKET" ] ; then
	error_exit "AUTOBUILD_BUCKET not set"
fi
if [ -z "$AUTOBUILD_DIST" ] ; then
	error_exit "AUTOBUILD_DIST not set"
fi
# max age for HTML files should be short, since they do not have unique names
# cloudfront can hold onto them for longer with cache policy since we invalidate
if [ -z "$AUTOBUILD_HTML_MAXAGE" ] ; then
	AUTOBUILD_HTML_MAXAGE=300
fi
# non-next managed images should also be fairly short
if [ -z "$AUTOBUILD_IMG_MAXAGE" ] ; then
	AUTOBUILD_IMG_MAXAGE=3600
fi
# next generated files should all be uniquely named, so can be long
if [ -z "$AUTOBUILD_NEXT_MAXAGE" ] ; then
	AUTOBUILD_NEXT_MAXAGE=86400
fi
# can also add immutable
if [ -z "$AUTOBUILD_NEXT_IMMUTABLE" ] ; then
	AUTOBUILD_NEXT_IMMUTABLE=1
fi
next_cache_control="max-age=$AUTOBUILD_NEXT_MAXAGE"
if [ "$AUTOBUILD_NEXT_IMMUTABLE" == "1" ] ; then
	next_cache_control="$next_cache_control, immutable"
fi

cd "$rootdir/out" || error_exit "missing out dir"

if [ ! -d ./_next ] ; then
	error_exit "missing _next dir"
fi

s3_cmd cp . s3://"$AUTOBUILD_BUCKET"/ --recursive --exclude "*" --include "*.html" --cache-control "max-age=$AUTOBUILD_HTML_MAXAGE" $dryrun
s3_cmd cp favicon.ico s3://"$AUTOBUILD_BUCKET"/ --cache-control "max-age=$AUTOBUILD_IMG_MAXAGE" $dryrun
s3_cmd sync _next s3://"$AUTOBUILD_BUCKET"/_next --cache-control "$next_cache_control" $dodelete $dryrun

# we should technically only need to invalidate the html files
# but patterns are limited
cf_cmd create-invalidation --distribution-id "$AUTOBUILD_DIST" --paths '/*'
