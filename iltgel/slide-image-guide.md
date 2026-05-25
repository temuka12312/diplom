# LOTUS Learn илтгэлийн зураг, диаграммын заавар

Шинэ илтгэлийн файл: `iltgel/LOTUS-Learn-iltgel-2026-05-18.pptx`

Доорх слайдуудад зураг, диаграмм оруулахад хамгийн тохиромжтой:

1. `Слайд 7 - Системийн архитектур`
   `Frontend (React) -> Django API -> PostgreSQL -> Gemini API` гэсэн 4 блоктой архитектурын диаграмм оруул.

2. `Слайд 8 - Хэрэглэгчийн урсгалын диаграмм`
   Зочин хэрэглэгч, бүртгэлтэй хэрэглэгч, админ гэсэн 3 actor-тай use case диаграмм оруул.
   Гол use case: `register`, `login`, `placement test`, `view courses`, `complete lesson`, `view progress`, `post in community`.

3. `Слайд 9 - Класс диаграмм`
   `User`, `LearningTrack`, `Course`, `Lesson`, `LessonProgress`, `LikedLesson`, `CommunityPost`, `CommunityComment` классуудтай UML class diagram оруул.

4. `Слайд 10 - Үйл ажиллагааны диаграмм`
   Хоёр урсгалаас нэгийг оруулбал сайн:
   `placement test өгөх -> level тооцох -> dashboard руу оруулах`
   `lesson дуусгах -> оноо хадгалах -> progress шинэчлэх`

5. `Слайд 11 - Дарааллын диаграмм`
   `User -> React frontend -> Django API -> DB -> AI engine` дараалалтай sequence diagram оруул.

6. `Слайд 12 - Өгөгдлийн ерөнхий схем`
   ERD зураг оруул.
   Гол холбоосууд:
   `User 1:N LessonProgress`
   `Course 1:N Lesson`
   `LearningTrack 1:N Course`
   `Lesson 1:N CommunityPost`
   `CommunityPost 1:N CommunityComment`

7. `Слайд 13`
   Landing page, Login, Register хуудасны screenshot оруул.

8. `Слайд 14`
   Dashboard, Courses, Lesson detail хуудасны screenshot оруул.

9. `Слайд 15`
   Placement test, Progress summary, Community, Games хуудасны screenshot оруул.

Зураг сонгох санал:

- Архитектурын слайдад цэвэрхэн block diagram хамгийн зөв.
- UI screenshot дээр desktop view сонго.
- Progress summary дээр bar chart эсвэл weekly activity chart харагддаг зураг оруул.
- Games хэсэгт filter, card list харагддаг screenshot сонговол илүү ойлгомжтой.
