import Container from "../Container";

function Lab1() {
  return (
    <div>
      <Container>
        <h1>Лабораторная работа 1</h1>
        <div style={{ padding: '20px', background: '#f7f7f769', borderRadius: '8px', margin: '20px 0' }}>
          <h2>Задание лабораторной работы:</h2>

          <ol style={{ lineHeight: '1.8', fontSize: '16px' }}>
            <li><strong>Реализовать скрипт, который уведомит о полной загрузке страницы</strong></li>

            <li><strong>Реализовать кнопку счетчик, которая будет увеличивать счетчик на "1" и вывести его значение на страницу (button onclick)</strong></li>

            <li><strong>Реализовать кнопку счетчик, которая будет уменьшать счетчик на "1" реализовать с помощью listener click</strong></li>

            <li><strong>Реализовать форму аутентификации пользователя (&lt;form&gt;)</strong></li>

            <li><strong>Реализовать скрипт очистки данных формы</strong></li>

            <li><strong>Реализовать скрипт отправки данных формы с помощью listener submit</strong></li>

            <li><strong>Без отправки на сервер провести валидацию введенных данных, если login=="admin" & pass=="admin" вывести сообщение об успехе, иначе сообщение о неуспехе</strong></li>

            <li><strong>Реализовать скрипт сохранения учетных данных и автоподстановку оных с помощью localStorage</strong></li>
          </ol>
        </div>
      </Container>
    </div>
  );
}

export default Lab1;