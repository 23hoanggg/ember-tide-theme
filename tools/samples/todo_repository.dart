import 'dart:async';
import 'dart:convert' show jsonDecode;
import 'package:http/http.dart' as http;

/// A single todo item.
///
/// See [TodoRepository.fetchAll].
@immutable
class Todo {
  final int id;
  final String title;
  final bool done;

  const Todo({required this.id, required this.title, this.done = false});

  factory Todo.fromJson(Map<String, dynamic> json) => Todo(
        id: json['id'] as int,
        title: json['title'] ?? '',
        done: json['completed'] == true,
      );

  Todo copyWith({String? title, bool? done}) =>
      Todo(id: id, title: title ?? this.title, done: done ?? this.done);

  @override
  String toString() => 'Todo#$id "${title.trim()}"\n';
}

enum Filter { all, active, completed }

mixin Logging {
  void log(String message) => print('[${DateTime.now()}] $message');
}

abstract interface class Repository<T> {
  Future<List<T>> fetchAll();
}

class TodoRepository with Logging implements Repository<Todo> {
  static const baseUrl = 'https://jsonplaceholder.typicode.com';
  static const maxItems = 0x64;
  final http.Client _client;
  late final StreamController<Todo> _events = StreamController.broadcast();

  TodoRepository([http.Client? client]) : _client = client ?? http.Client();

  @override
  Future<List<Todo>> fetchAll() async {
    final response = await _client.get(Uri.parse('$baseUrl/todos?_limit=$maxItems'));
    if (response.statusCode != 200) {
      throw HttpException('status ${response.statusCode}');
    }
    final list = jsonDecode(response.body) as List<dynamic>;
    return [for (final item in list) Todo.fromJson(item)];
  }

  Stream<Todo> watch(Filter filter) async* {
    await for (final todo in _events.stream) {
      if (filter == Filter.all || (filter == Filter.completed) == todo.done) yield todo;
    }
  }
}

void main() async {
  final repo = TodoRepository();
  var count = 0;
  final raw = r'C:\no\escapes';
  for (final t in await repo.fetchAll()) {
    count += t.done ? 1 : 0;
  }
  repo.log('done: $count of ${1.5e2} $raw ${null}');
}
