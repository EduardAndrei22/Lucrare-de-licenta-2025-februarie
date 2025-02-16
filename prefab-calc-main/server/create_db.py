import psycopg2
from psycopg2 import sql
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT


def create_db(cur) -> None:
    cur.execute(sql.SQL("DROP DATABASE IF EXISTS prefabdb WITH (force);"))
    cur.execute(sql.SQL("CREATE DATABASE prefabdb OWNER postgres ENCODING 'UTF-8';"))


def main(password: str) -> None:
    con = psycopg2.connect(
        dbname="postgres", user="postgres", host="localhost", password=password
    )

    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)

    cur = con.cursor()

    create_db(cur)

    cur.close()
    con.close()


if __name__ == "__main__":
    main("greutare")
