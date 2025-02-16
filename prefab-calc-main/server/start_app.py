import os


def main() -> None:
    print("Starting app in dev mode...")

    os.system("start cmd /C python manage.py runserver")
    os.chdir("..//front-end//")
    os.system("start cmd /C ng serve -o")

    print("App is running")


if __name__ == '__main__':
    main()
