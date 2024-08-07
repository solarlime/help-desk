/* eslint-disable import/no-cycle, class-methods-use-this */
import Modals from './modals';
import validation from './validation';
import Storage from './storage';

const breakDescription = (description) => {
  const container = document.createElement('div');
  container.innerText = description;
  return container;
};

export default class Page {
  constructor() {
    this.page = document.body;
    this.tipCheckbox = this.page.querySelector('#tip');
    this.plus = this.page.querySelector('.title-container-plus');
    this.modalAddUpdate = this.page.querySelector('.modal-add-update');
    this.modalDelete = this.page.querySelector('.modal-delete');
    this.dancer = this.page.querySelector('.modal-dancer');
    this.form = this.page.querySelector('form#add-and-update');
    this.cancels = this.page.querySelectorAll('button.cancel');
    this.save = this.page.querySelector('button.save');
    this.delete = this.page.querySelector('button.delete');
    this.error = this.page.querySelector('.error');
    this.table = this.page.querySelector('ul.list');
    this.validity = {
      title: false,
      description: true,
    };
    this.save.disabled = true;
    this.list = null;
  }

  /**
   * Обрабатываем следующие события:
   * - Новая задача
   * - Отмена действия и закрытие подсказки
   * - Изменение задачи, удаление задачи, спойлер
   * - Ввод данных и проверка
   * - Подтверждение сохранения
   * - Подтверждение удаления
   */
  addListeners() {
    this.plus.addEventListener('click', () => {
      this.targetRowId = undefined;
      Modals.show(this.modalAddUpdate);
    });

    this.cancels.forEach((cancel) => {
      cancel.addEventListener('click', (event) => {
        if (event.target.closest('.modal-container').classList.contains('modal-add-update')) {
          Modals.cancel(this.modalAddUpdate);
        }
        if (event.target.closest('.modal-container').classList.contains('modal-delete')) {
          Modals.cancel(this.modalDelete);
        }
        this.save.disabled = true;
        this.validity = { title: false, description: true };
        this.error.classList.add('hidden');
      });
    });

    this.table.addEventListener('click', async (event) => {
      // event.target - не всегда <svg>: иногда <path>. Поправляем
      const resolveSVG = () => {
        if (!event.target.ownerSVGElement) {
          return event.target;
        }
        return event.target.ownerSVGElement;
      };
      const item = resolveSVG();
      if (item.classList.value === 'list-item-actions-update') {
        this.targetRowId = item.closest('li').getAttribute('data-id');
        this.validity = { title: false, description: true };
        this.save.disabled = true;
        Modals.show(this.modalAddUpdate, this.targetRowId, this.list.data);
      } else if (item.classList.value === 'list-item-actions-delete') {
        this.targetRowId = item.closest('li').getAttribute('data-id');
        Modals.show(this.modalDelete);
      } else if (item.classList.value === 'list-item-done') {
        await this.quickSave(event.target);
      } else {
        const spoiler = document.elementsFromPoint(event.clientX, event.clientY)
          .find((element) => element.classList.contains('spoiler'));
        if (spoiler) {
          spoiler.querySelector('.list-item-description').classList.toggle('hidden');
          spoiler.querySelector('.list-item-description').classList.toggle('no-spoiler');
        }
      }
    });

    this.form.querySelectorAll('input, textarea').forEach((input) => {
      input.addEventListener('input', (event) => {
        this.validity[event.target.id] = validation(event.target, this.save);
        // Обрабатываем ситуацию, когда нужно изменить только описание
        if (event.target.id === 'description') {
          this.validity.title = validation(this.page.querySelector('#title'), this.save);
        }
      });
    });

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!this.save.disabled) {
        this.save.dispatchEvent(new Event('click'));
      }
    });

    this.form.addEventListener('input', () => {
      // Блокируем кнопку в случае, если будет хотя бы одно невалидное поле
      this.save.disabled = Object.values(this.validity).some((input) => input === false);
    });

    this.save.addEventListener('click', async () => {
      this.dancer.classList.remove('hidden');
      await Modals.save(this.save, this.targetRowId, this.modalAddUpdate, this.list.data);
      await this.update();
      this.dancer.classList.add('hidden');
    });

    this.delete.addEventListener('click', async () => {
      this.dancer.classList.remove('hidden');
      await Modals.delete(this.targetRowId, this.modalDelete, this.list.data);
      await this.update();
      this.dancer.classList.add('hidden');
    });
  }

  /**
   * Функция изменения статуса готовности
   *
   * @param checkbox: флажок, на который нажали (через label)
   */
  async quickSave(checkbox) {
    const row = checkbox.closest('li');
    const target = this.list.data.find((item) => item.id.toString() === row.getAttribute('data-id'));
    target.done = checkbox.checked;

    // Sending a request
    const formData = new FormData();
    Object.entries({ id: row.getAttribute('data-id'), done: checkbox.checked })
      .forEach((field) => formData.append(field[0], field[1]));
    this.dancer.classList.remove('hidden');
    try {
      await Storage.request('update', formData);
    } catch (e) {
      alert('A problem with updating! Try to reload this page');
    }
    this.dancer.classList.add('hidden');
  }

  /**
   * Функция отрисовки пунктов
   *
   * @param item: элемент массива данных
   */
  render(item) {
    const newRow = document.createElement('li');
    newRow.setAttribute('class', 'list-item');
    newRow.setAttribute('data-id', `${item.id}`);

    const newDoneContainer = document.createElement('div');
    newDoneContainer.setAttribute('class', 'list-item-done-container');

    const newDone = document.createElement('input');
    newDone.setAttribute('class', 'list-item-done');
    newDone.setAttribute('type', 'checkbox');
    newDone.setAttribute('id', `${item.id}`);
    newDone.checked = item.done;

    const newDoneLabel = document.createElement('label');
    newDoneLabel.setAttribute('for', `${item.id}`);

    newDoneContainer.append(newDone, newDoneLabel);
    newRow.append(newDoneContainer);

    // Списки содержат символы новой строки. Обрабатываем их для правильной отрисовки
    const enter = '\n';
    const htmlDescription = item.description.includes(enter)
      ? breakDescription(item.description) : item.description;

    const listItemTicket = document.createElement('div');
    listItemTicket.classList.add('list-item-ticket');

    const listItemTitle = document.createElement('div');
    listItemTitle.classList.add('list-item-title');
    listItemTitle.textContent = item.name;

    const listItemDescription = document.createElement('div');
    listItemDescription.classList.add('list-item-description');
    listItemDescription.append(htmlDescription);

    const listItemDate = document.createElement('div');
    listItemDate.classList.add('list-item-date');
    listItemDate.textContent = item.date;

    const listItemActions = document.createElement('div');
    listItemActions.classList.add('list-item-actions');
    listItemActions.insertAdjacentHTML('beforeend', '<svg class="list-item-actions-update" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 469.336 469.336" xml:space="preserve">\n'
      + '                        <g><g><path d="M456.836,76.168l-64-64.054c-16.125-16.139-44.177-16.17-60.365,0.031L45.763,301.682c-1.271,1.282-2.188,2.857-2.688,4.587L0.409,455.73c-1.063,3.722-0.021,7.736,2.719,10.478c2.031,2.033,4.75,3.128,7.542,3.128\n'
      + '\t\t\tc0.979,0,1.969-0.136,2.927-0.407l149.333-42.703c1.729-0.5,3.302-1.418,4.583-2.69l289.323-286.983\n'
      + '\t\t\tc8.063-8.069,12.5-18.787,12.5-30.192S464.899,84.237,456.836,76.168z M285.989,89.737l39.264,39.264L120.257,333.998\n'
      + '\t\t\tl-14.712-29.434c-1.813-3.615-5.5-5.896-9.542-5.896H78.921L285.989,89.737z M26.201,443.137L40.095,394.5l34.742,34.742\n'
      + '\t\t\tL26.201,443.137z M149.336,407.96l-51.035,14.579l-51.503-51.503l14.579-51.035h28.031l18.385,36.771\n'
      + '\t\t\tc1.031,2.063,2.708,3.74,4.771,4.771l36.771,18.385V407.96z M170.67,390.417v-17.082c0-4.042-2.281-7.729-5.896-9.542\n'
      + '\t\t\tl-29.434-14.712l204.996-204.996l39.264,39.264L170.67,390.417z M441.784,121.72l-47.033,46.613l-93.747-93.747l46.582-47.001\n'
      + '\t\t\tc8.063-8.063,22.104-8.063,30.167,0l64,64c4.031,4.031,6.25,9.385,6.25,15.083S445.784,117.72,441.784,121.72z"></path></g></g>\n'
      + '                        </svg>\n'
      + '                        <svg class="list-item-actions-delete" viewBox="-47 0 512 512" xmlns="http://www.w3.org/2000/svg">\n'
      + '                            <path d="m416.875 114.441406-11.304688-33.886718c-4.304687-12.90625-16.339843-21.578126-29.941406-21.578126h-95.011718v-30.933593c0-15.460938-12.570313-28.042969-28.027344-28.042969h-87.007813c-15.453125 0-28.027343 12.582031-28.027343 28.042969v30.933593h-95.007813c-13.605469 0-25.640625 8.671876-29.945313 21.578126l-11.304687 33.886718c-2.574219 7.714844-1.2695312 16.257813 3.484375 22.855469 4.753906 6.597656 12.445312 10.539063 20.578125 10.539063h11.816406l26.007813 321.605468c1.933594 23.863282 22.183594 42.558594 46.109375 42.558594h204.863281c23.921875 0 44.175781-18.695312 46.105469-42.5625l26.007812-321.601562h6.542969c8.132812 0 15.824219-3.941407 20.578125-10.535157 4.753906-6.597656 6.058594-15.144531 3.484375-22.859375zm-249.320312-84.441406h83.0625v28.976562h-83.0625zm162.804687 437.019531c-.679687 8.402344-7.796875 14.980469-16.203125 14.980469h-204.863281c-8.40625 0-15.523438-6.578125-16.203125-14.980469l-25.816406-319.183593h288.898437zm-298.566406-349.183593 9.269531-27.789063c.210938-.640625.808594-1.070313 1.484375-1.070313h333.082031c.675782 0 1.269532.429688 1.484375 1.070313l9.269531 27.789063zm0 0"></path><path d="m282.515625 465.957031c.265625.015625.527344.019531.792969.019531 7.925781 0 14.550781-6.210937 14.964844-14.21875l14.085937-270.398437c.429687-8.273437-5.929687-15.332031-14.199219-15.761719-8.292968-.441406-15.328125 5.925782-15.761718 14.199219l-14.082032 270.398437c-.429687 8.273438 5.925782 15.332032 14.199219 15.761719zm0 0"></path>\n'
      + '                            <path d="m120.566406 451.792969c.4375 7.996093 7.054688 14.183593 14.964844 14.183593.273438 0 .554688-.007812.832031-.023437 8.269531-.449219 14.609375-7.519531 14.160157-15.792969l-14.753907-270.398437c-.449219-8.273438-7.519531-14.613281-15.792969-14.160157-8.269531.449219-14.609374 7.519532-14.160156 15.792969zm0 0"></path>\n'
      + '                            <path d="m209.253906 465.976562c8.285156 0 15-6.714843 15-15v-270.398437c0-8.285156-6.714844-15-15-15s-15 6.714844-15 15v270.398437c0 8.285157 6.714844 15 15 15zm0 0"></path>\n'
      + '                        </svg>');
    if (item.description) {
      listItemTicket.classList.add('spoiler');
      listItemDescription.classList.add('hidden');
    }

    listItemTicket.append(listItemTitle, listItemDescription);
    newRow.append(listItemTicket, listItemDate, listItemActions);
    this.table.append(newRow);
  }

  /**
   * Функция обновления страницы
   *
   * @param full: true - загрузка данных из удалённой БД. По умолчанию - false
   */
  async update(full = false) {
    document.querySelectorAll('li.list-item').forEach((item) => item.remove());
    if (this.tipCheckbox.checked) {
      this.tipCheckbox.checked = false;
    }
    this.dancer.classList.remove('hidden');
    if (full) {
      try {
        this.list = await Storage.request('fetch');
      } catch (e) {
        alert('A problem with fetching! Try to reload this page');
        this.list = { status: 'Not fetched', data: [] };
      }
    }
    if (this.list.data) {
      this.list.data.forEach((item) => this.render(item));
      this.dancer.classList.add('hidden');
    }
  }
}
