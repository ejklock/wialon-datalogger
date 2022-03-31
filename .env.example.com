DB_URL=postgres://postgres:password@localhost:5444/wialon
ENTITY_PATH=dist/**/**/*.entity{.js,.ts}
WIALON_PROD_TOKEN
