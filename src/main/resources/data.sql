-- Clear existing data (if any)
TRUNCATE TABLE flashcards CASCADE;
TRUNCATE TABLE users CASCADE;

-- Insert users first (password: admin123 for both)
INSERT INTO users (username, email, password, role, enabled, created_at) VALUES
                                                                             ('admin', 'admin@flashcard.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'ADMIN', true, NOW()),
                                                                             ('user1', 'user1@flashcard.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'USER', true, NOW());

-- Insert flashcards for Java documentation (user_id matches admin's ID)
INSERT INTO flashcards (front_content, back_content, category, difficulty_level, language, example_code, tags, view_count, mastery_score, created_at, user_id)
SELECT
    'Purpose of `public` keyword in Java?',
    'The `public` keyword is an access modifier that makes the class, method, or field accessible from any other class. It''s the most permissive access level.',
    'Access Modifiers', 'BEGINNER', 'java',
    'public class MyClass {
    public int myNumber;
    public void myMethod() {
        System.out.println("Public method");
    }
}',
    'access-modifier,oop,basics,visibility', 0, 0, NOW(), id
FROM users WHERE username = 'admin';

INSERT INTO flashcards (front_content, back_content, category, difficulty_level, language, example_code, tags, view_count, mastery_score, created_at, user_id)
SELECT
    'Difference between `==` and `.equals()`?',
    '`==` compares object references (memory addresses), while `.equals()` compares the actual content/values of objects. For Strings, use `.equals()` for content comparison.',
    'Object Comparison', 'BEGINNER', 'java',
    'String s1 = new String("hello");
String s2 = new String("hello");
System.out.println(s1 == s2); // false (different objects)
System.out.println(s1.equals(s2)); // true (same content)',
    'comparison,strings,objects,equality', 0, 0, NOW(), id
FROM users WHERE username = 'admin';

INSERT INTO flashcards (front_content, back_content, category, difficulty_level, language, example_code, tags, view_count, mastery_score, created_at, user_id)
SELECT
    'What is method overriding?',
    'Method overriding occurs when a subclass provides a specific implementation of a method already defined in its superclass. Must have same signature and return type.',
    'Inheritance', 'INTERMEDIATE', 'java',
    'class Animal {
    void makeSound() {
        System.out.println("Animal makes a sound");
    }
}

class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Dog barks");
    }
}',
    'inheritance,polymorphism,oop,methods', 0, 0, NOW(), id
FROM users WHERE username = 'admin';

INSERT INTO flashcards (front_content, back_content, category, difficulty_level, language, example_code, tags, view_count, mastery_score, created_at, user_id)
SELECT
    'What are Java Streams?',
    'Streams in Java 8+ provide a functional approach to process collections of objects. They support operations like map, filter, reduce and can be processed sequentially or in parallel.',
    'Streams API', 'ADVANCED', 'java',
    'List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
int sum = numbers.stream()
                .filter(n -> n % 2 == 0)
                .mapToInt(n -> n * 2)
                .sum();
System.out.println(sum); // 12',
    'streams,lambda,functional-programming,java8,collections', 0, 0, NOW(), id
FROM users WHERE username = 'admin';

INSERT INTO flashcards (front_content, back_content, category, difficulty_level, language, example_code, tags, view_count, mastery_score, created_at, user_id)
SELECT
    'What is `volatile` keyword used for?',
    'The `volatile` keyword ensures that multiple threads always see the most up-to-date value of a variable. It prevents thread caching and ensures visibility across threads.',
    'Concurrency', 'ADVANCED', 'java',
    'public class SharedObject {
    private volatile boolean flag = false;

    public void setFlag() {
        flag = true; // Immediately visible to all threads
    }

    public boolean getFlag() {
        return flag; // Always reads from main memory
    }
}',
    'concurrency,threading,volatile,multithreading', 0, 0, NOW(), id
FROM users WHERE username = 'admin';

INSERT INTO flashcards (front_content, back_content, category, difficulty_level, language, example_code, tags, view_count, mastery_score, created_at, user_id)
SELECT
    'What is the `final` keyword?',
    'The `final` keyword can be used with variables, methods, and classes. A final variable cannot be reassigned, a final method cannot be overridden, and a final class cannot be extended.',
    'Keywords', 'BEGINNER', 'java',
    'final int MAX_VALUE = 100; // Cannot change
final class MathUtils { // Cannot extend
    final double calculate() { // Cannot override
        return 42.0;
    }
}',
    'final,keywords,oop,basics', 0, 0, NOW(), id
FROM users WHERE username = 'admin';

INSERT INTO flashcards (front_content, back_content, category, difficulty_level, language, example_code, tags, view_count, mastery_score, created_at, user_id)
SELECT
    'What is an Interface?',
    'An interface is a reference type that can contain only constants, method signatures, default methods, static methods, and nested types. It cannot contain instance fields or constructors.',
    'Interfaces', 'INTERMEDIATE', 'java',
    'interface Drawable {
    void draw(); // Abstract method

    default void resize() { // Default method
        System.out.println("Resizing");
    }

    static void printInfo() { // Static method
        System.out.println("Drawable interface");
    }
}',
    'interfaces,abstract,oop,design', 0, 0, NOW(), id
FROM users WHERE username = 'admin';

-- Insert some flashcards for user1 as well
INSERT INTO flashcards (front_content, back_content, category, difficulty_level, language, example_code, tags, view_count, mastery_score, created_at, user_id)
SELECT
    'What is autoboxing?',
    'Autoboxing is the automatic conversion that Java compiler makes between primitive types and their corresponding object wrapper classes (int to Integer, double to Double, etc.).',
    'Type Conversion', 'INTERMEDIATE', 'java',
    'List<Integer> numbers = new ArrayList<>();
numbers.add(5); // Autoboxing: int to Integer
int num = numbers.get(0); // Unboxing: Integer to int',
    'autoboxing,wrapper-classes,type-conversion', 0, 0, NOW(), id
FROM users WHERE username = 'user1';

INSERT INTO flashcards (front_content, back_content, category, difficulty_level, language, example_code, tags, view_count, mastery_score, created_at, user_id)
SELECT
    'What is a Lambda Expression?',
    'A lambda expression is a short block of code which takes in parameters and returns a value. Lambda expressions are similar to methods, but they do not need a name and can be implemented right in the body of a method.',
    'Lambda Expressions', 'ADVANCED', 'java',
    '// Without lambda
Runnable r1 = new Runnable() {
    public void run() {
        System.out.println("Hello");
    }
};

// With lambda
Runnable r2 = () -> System.out.println("Hello");',
    'lambda,functional-programming,java8', 0, 0, NOW(), id
FROM users WHERE username = 'user1';