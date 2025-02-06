import json
from faker import Faker
import random

fake = Faker()


def generate_categories(filename="src/data/json/category.json", num_categories=50):
    categories = []
    for _ in range(num_categories):
        category_name = fake.unique.word().capitalize()
        category = {"name": category_name}
        categories.append(category)

    with open(filename, "w") as file:
        json.dump(categories, file, indent=2)

    print(f"File '{filename}' has been created/overwritten successfully.")


def generate_products(filename="src/data/json/product.json", num_products=50):
    products = []
    for _ in range(num_products):
        product_name = fake.sentence(nb_words=2).capitalize()
        product_price = str(random.randint(10000, 10000000))
        product = {
            "name": product_name,
            "price": product_price,
            "category_id": None,
        }
        products.append(product)

    with open(filename, "w") as file:
        json.dump(products, file, indent=2)

    print(f"File '{filename}' has been created/overwritten successfully.")


def generate_todos(filename="src/data/json/todo.json", num_todos=50):
    todos = []
    for _ in range(num_todos):
        todo = {"text": fake.sentence(nb_words=10)}
        todos.append(todo)

    with open(filename, "w") as file:
        json.dump(todos, file, indent=2)

    print(f"File '{filename}' has been created/overwritten successfully.")


def main():
    while True:
        print("Select an option:")
        print("1. Generate Todos")
        print("2. Generate Categories")
        print("3. Generate Products")
        print("0. Exit")
        choice = input("Enter your choice (0/1/2/3): ")

        if choice == "1":
            generate_todos(num_todos=50)
        elif choice == "2":
            generate_categories(num_categories=50)
        elif choice == "3":
            generate_products(num_products=50)
        elif choice == "0":
            print("Exiting the program.")
            break
        else:
            print("Invalid choice. Please enter 0, 1, 2, or 3.")


if __name__ == "__main__":
    main()
