#!/bin/bash

set -e

host="$1"
shift
port="$1"
shift
cmd="$@"

until nc -z "$host" "$port"; do
  >&2 echo "Waiting for database at $host:$port..."
  sleep 1
done

>&2 echo "Database is up - executing command"
exec $cmd
