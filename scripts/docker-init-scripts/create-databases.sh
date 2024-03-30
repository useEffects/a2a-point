#!/bin/bash

set -eu

function create_database() {
  local database=$1
  echo "  Creating database '$database'"
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE $database WITH OWNER = $POSTGRES_USER ENCODING = 'UTF8' LC_COLLATE = 'C' LC_CTYPE = 'C' TEMPLATE template0;
EOSQL
}

create_database $POSTGRES_DB1
create_database $POSTGRES_DB2
create_database $POSTGRES_DB3
