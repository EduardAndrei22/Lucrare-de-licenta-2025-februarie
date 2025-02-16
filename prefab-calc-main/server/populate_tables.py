import psycopg2
from psycopg2 import sql
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from datetime import datetime

import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "server.settings")
from django.contrib.auth.hashers import make_password


def add_to_tables(cur) -> None:
    try:
        cur.execute(sql.SQL("DELETE FROM main_category;"))
        cur.execute(sql.SQL("DELETE FROM main_category_items;"))
        cur.execute(sql.SQL("DELETE FROM main_prefabitem;"))
        cur.execute(sql.SQL("DELETE FROM authentication_variables;"))
    except:
        pass


    cur.execute(
        sql.SQL(
            "INSERT INTO main_prefabitem (name, description, thumbnail, internalname, instock, stock, price, product_code) VALUES ('"
            "Cămin Rectangular', 'Realizat din cămin vibrat (clasa C 20/25)', "
            "'https://eprefabricate.ro/wp-content/uploads/2022/10/Camin-patrat.jpg', 'camin_beton_rect', 1, 99, -1, 0);"
        )
    )
    cur.execute(
        sql.SQL(
            "INSERT INTO main_prefabitem (name, description, thumbnail, internalname, instock, stock, price, product_code) VALUES ("
            "'Capac cămin rectangular', 'Realizat din beton vibrat (clasa C 20/25). Folosit "
            "pentru acoperirea căminelor.', "
            "'https://eprefabricate.ro/wp-content/uploads/2022/09/capac_camin3-1.jpg', "
            "'capac_camin_beton_rect', 1, 99, -1, 1);"
        )
    )
    cur.execute(
        sql.SQL(
            "INSERT INTO main_prefabitem (name, description, thumbnail, internalname, instock, stock, price, product_code) VALUES ("
            "'Cămin Rotund', 'Realizat din beton vibrat (clasa C 20/25)."
            "', "
            "'https://eprefabricate.ro/wp-content/uploads/2022/09/SPAU-beton-2000-mm.jpg', "
            "'camin_rotund', 1, 99, -1, 1);"
        )
    )
    cur.execute(
        sql.SQL(
            "INSERT INTO main_prefabitem (name, description, thumbnail, internalname, instock, stock, price, product_code) VALUES ("
            "'Capac cămin rotund', 'Realizat din beton vibrat (clasa C 20/25). Folosit "
            "pentru acoperirea căminelor.', "
            "'https://eprefabricate.ro/wp-content/uploads/2024/03/Capac-camin-din-beton-rotund.jpg', "
            "'capac_camin_rotund', 1, 99, -1, 1);"
        )
    )
    cur.execute(
        sql.SQL(
            "INSERT INTO main_prefabitem (name, description, thumbnail, internalname, instock, stock, price, product_code) VALUES ("
            "'Spalier', 'Realizat din beton vibrat (clasa C 20/25)."
            "', "
            "'https://eprefabricate.ro/wp-content/uploads/2024/04/spalieri-vita-de-vie.png', "
            "'spalier', 1, 99, -1, 1);"
        )
    )

    cur.execute(
        sql.SQL(
            "INSERT INTO authentication_variables (name, value) VALUES ('masterpassword', 'master');"
        )
    )

    cur.execute(
        sql.SQL("INSERT INTO main_category (name) VALUES ('Camine rectangulare');")
    )

    cur.execute(
        sql.SQL(
            "insert into main_category (name) values ('Capace de camin rectangulare');"
        )
    )

    cur.execute(sql.SQL("insert into main_category (name) values ('Camine rotunde');"))

    cur.execute(
        sql.SQL("insert into main_category (name) values ('Capace de camin rotunde');")
    )

    cur.execute(sql.SQL("insert into main_category (name) values ('Spalieri');"))

    cur.execute(sql.SQL("insert into main_category (name) values ('Mobilier urban');"))

    cur.execute(sql.SQL("insert into main_category (name) values ('Necategorizat');"))

    admin_pass = make_password("abcdefgh")
    cur.execute(
        sql.SQL(
            f"INSERT INTO auth_user (id, username, password, is_superuser, first_name, last_name, email, is_staff, is_active, date_joined) VALUES (1, 'EdiAndrei', '{admin_pass}', true, '', '', '', true, true, '{datetime.now()}');"
        )
    )

    cur.execute(
        sql.SQL(
            f"INSERT INTO authentication_adminuser (user_id) VALUES (1);"
        )
    )


def main(password: str) -> None:
    con = psycopg2.connect(
        dbname="prefabdb", user="postgres", host="localhost", password="greutare123"
    )

    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)

    cur = con.cursor()

    add_to_tables(cur)

    cur.close()
    con.close()


if __name__ == "__main__":
    main("greutare")
