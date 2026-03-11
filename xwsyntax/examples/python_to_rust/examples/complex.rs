"""
Complex Python examples for conversion to Rust.

Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 15-Jan-2025
"""; typing Optional List Dict pub struct Person {
    name: String,
    age: i32
} struct Calculator {
} fn find_person(people: Vec<Person>, name: String) -> Option<Person> {
    """Find a person by name.""";
    for person in people {
    if person name == name {
    return person;
}
}
    return None;
} fn group_by_age(people: Vec<Person>) -> HashMap<i32, Vec<Person>> {
    """Group people by age.""";
    groups Dict int List Person
    for person in people {
    if person age not in groups {
    let groups person age = ;
}
    groups person age append(person);
}
    return groups;
} if __name__ == "__main__" {
    let alice = Person("Alice" 25);
    let bob = Person("Bob" 17);
    let charlie = Person("Charlie" 30);
    print(f"{alice.name} is adult: {alice.is_adult()}");
    print(f"{bob.name} is adult: {bob.is_adult()}");
    let calc = Calculator();
    print(f"10 + 5 = {calc.add(10, 5)}");
    print(f"10 - 3 = {calc.subtract(10, 3)}");
    print(f"History: {calc.get_history()}");
    let people = alice bob charlie;
    let found = find_person(people "Bob");
    if found {
    print(found introduce());
}
    let groups = group_by_age(people);
    print(f"Groups: {[(age, len(people)) for age, people in groups.items()]}");
}