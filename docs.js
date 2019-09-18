// https://metanit.com/nosql/mongodb/2.4.php

const db = {
    name: 'Tom',
    age: 28,
    count: 5,
    languages: [ // при добавление элементов внутрь массива _id будет создан автоматический
        { name: 'english' },
        { name: 'spanish' },
        { name: 'spanish' }
    ]
};

/* Условные операторы

Условные операторы задают условие, которому должно соответствовать значение поля документа:

$eq --------  (равно)

$ne --------  (не равно)

$gt --------  (больше чем)

$lt --------  (меньше чем)

$gte -------- (больше или равно)

$lte -------- (меньше или равно)

$in --------  определяет массив значений, одно из которых должно иметь поле документа

$nin -------- определяет массив значений, которые не должно иметь поле документа

Например, найдем все документы, у которых значение ключа age меньше 30:

db.users.find ({age: {$lt : 30}})

*/

// ========================================================================================================================

/* Логические операторы

Логические операторы выполняются над условиями выборки:

$or: --------  соединяет два условия, и документ должен соответствовать одному из этих условий

$and: -------- соединяет два условия, и документ должен соответствовать обоим условиям

$not: -------- документ должен НЕ соответствовать условию

$nor: -------- соединяет два условия, и документ должен НЕ соответстовать обоим условиям

Например вернет нам все документы, в которых либо name=Tom, либо age=22.

db.users.find ({$or : [{name: "Tom"}, {age: 22}]})

Другой пример вернет нам все документы, в которых name=Tom, а age равно либо 22, либо среди значений languages есть "german":

db.users.find ({name: "Tom", $or : [{age: 22}, {languages: "german"}]})
*/


/* Добавить документ
======================================================================================================================== */
db.users.insertOne({ name: 'Tom', age: 28, languages: [{ name: 'english' }, { name: 'spanish' }] });

/* Добавить несколько документов
======================================================================================================================== */
db.users.insertMany([
    { name: 'Bob', age: 26, languages: [{ name: 'english' }, { name: 'frensh' }] },
    { name: 'Alice', age: 31, languages: [{ name: 'german' }, { name: 'english' }] }
]);

/* Удалить документ
 Если второй параметр равен true, то удаляется только один элемент. По умолчанию он равен false:
======================================================================================================================== */
db.users.remove({ name: 'Tom' }, true);

/* Удалить все документы в колекции
======================================================================================================================== */
db.users.remove({});

/* Удалить по ID
======================================================================================================================== */
db.users.findByIdAndDelete('5d80831f200d0018182d0442');

/* Найти все
======================================================================================================================== */
db.users.find();

/* Найти по ID
======================================================================================================================== */
db.users.findById('5d80831f200d0018182d0442');

/* Получить массив совпадений
======================================================================================================================== */
db.users.find({ name: 'Tom', age: 32 });

/* Получить массив вложеных совпадений
======================================================================================================================== */
db.users.find({ 'languages.name': 'Толик' });

/* убрать из ответа значение age, name
======================================================================================================================== */
db.users.find({}, { age: false, name: false });

/* в ответе будут только значение age, name
======================================================================================================================== */
db.users.find({}, { age: true, name: true });

/* Найти по id и обновить
======================================================================================================================== */
db.users.findByIdAndUpdate('id',
    { $set: { model: 'Новое значение' } }, // изменить свойство model на новое значение
    { $push: { friends: 'Young Banks' } }, // добавить в массив friends: [] значение Young Banks
    { upsert: true }, // upsert: true Создаст документы если его нет
    // safe: true означает подождть успешной записи
    { new: true } // new true вернет обратно обновленый элемент
);

/* Увеличить на 1
======================================================================================================================== */
db.users.updateOne({ name: 'Tom' }, { $inc: { count: 1 } });

/* Изменить поле
======================================================================================================================== */
db.users.updateOne({ name: 'Tom' }, { $set: { name: 'Назар' } });

/* Удалить поле
======================================================================================================================== */
db.users.updateOne({ name: 'Tom' }, { $unset: { name: true } });

/* добавить еще одно значение в конец миссива (если массива нет он будет создан)
======================================================================================================================== */
db.users.updateOne({ age: 50 }, { $push: { languages: { name: 'Spain' } } });

/* добавитьзначение в начало массива (если массива нет он будет создан) $position: 0 | 1 | 2 | 3 | 4
======================================================================================================================== */
db.users.updateOne({ _id: 1 }, { $push: { languages: { $each: [{ name: 'Русский' }, { name: 'Украинский' }], $position: 0 } } });

/* добавить значение в массив только его его там еще нет (только для простых массивов)
пример ["Китай", "Украина", "Россия"] (если массива нет он будет создан)
======================================================================================================================== */
db.users.updateOne({ age: 50 }, { $addToSet: { country: 'Китай' } });

/* добавить значение в массив только его его там еще нет для сложных массивов
======================================================================================================================== */
const example = {
    profile_set: [
        { name: 'nick', options: 0 },
        { name: 'joe', options: 2 },
        { name: 'burt', options: 1 }
    ]
};

db.coll.update(
    { '_id': '5d80831f200d0018182d0442', 'profile_set.name': { $ne: 'nick' } },
    { $push: { profile_set: { name: 'nick', options: 2 } } });

/* Удалить первый элемент массива
======================================================================================================================== */
db.users.updateOne({ age: 50 }, { $pop: { languages: 1 } });

/* Удалить последний элемент массива
======================================================================================================================== */
db.users.updateOne({ age: 50 }, { $pop: { languages: -1 } });

/* Удалить элемент по название в массиве
======================================================================================================================== */
db.users.updateOne({ age: 50 }, { $pull: { languages: { name: 'Английский' } } });

/* Удалить несколько элементов по название в массиве только для простых массивов
["Китай", "Украина", "Россия"]
============================================================================================ */
db.users.updateOne({ age: 50 }, { $pullAll: { languages: [{ name: 'Россия' }, { name: 'Китай' }] } });

/* Количество элементов в колекции
======================================================================================================================== */
db.users.find({ name: 'Tom' }).count();
db.users.find({ name: 'Tom' }).countDocuments();

/* Получить массив уникальные значение
======================================================================================================================== */
db.users.distinct('languages.name');

/* Получить массив уникальные значение
======================================================================================================================== */
db.users.distinct('languages.name');

/* максимально допустимое количество получаемых документов -> можно использыват для пагинации
======================================================================================================================== */
db.users.find().limit(3);

/* пропустим первые три записи -> можно использыват для пагинации
======================================================================================================================== */
db.users.find().skip(3);

/*  по возрастанию (1) или по убыванию (-1)
======================================================================================================================== */
db.users.find().sort({ age: 1 });

/* Удаление коллекций и баз данных
======================================================================================================================== */
db.users.drop();

/* Чтобы удалить всю базу данных, надо воспользоваться функцией dropDatabase():
======================================================================================================================== */
db.dropDatabase();

/* Следующий документ
======================================================================================================================== */
db.users.findOne({ _id: { $lt: parent.id } }).sort({ _id: -1 });

/* Предыдущый докумены
======================================================================================================================== */
db.users.findOne({ _id: { $gt: parent.id } }).sort({ _id: 1 });

/* Средний рейтинг
======================================================================================================================== */
db.users.aggregate([
    { $match: { post_id: parent.id } }, // отобрать совпадения для дальнейшей обработки
    { $group: { _id: null, average: { $avg: '$rating' } } }
]);
