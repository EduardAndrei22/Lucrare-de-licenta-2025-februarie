import populate_tables
import create_db
import sys
import os


def main() -> None:
    argv = sys.argv
    db_pass = argv[1]

    print("Installing python dependencies...")
    os.system("pip install -r requirements.txt")

    print("Creating database...")
    create_db.main(db_pass)
    os.system("python manage.py makemigrations")
    os.system("python manage.py migrate")
    populate_tables.main(db_pass)

    print("App is ready")


if __name__ == "__main__":
    main()
