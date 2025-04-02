/*
import { test, expect } from '@playwright/test';

// Тест основной страницы
test('Главная страница загружается и содержит ожидаемый заголовок', async ({ page }) => {
  await page.goto('https://example-booking-service.com');
  
  // Проверяем заголовок страницы
  await expect(page).toHaveTitle(/Турагентство/);
  
  // Проверяем наличие формы поиска тура
  const searchForm = page.locator('.search-form');
  await expect(searchForm).toBeVisible();
});

// Тест поиска туров
test('Поиск тура работает корректно', async ({ page }) => {
  await page.goto('https://example-booking-service.com');
  
  // Заполняем форму поиска
  await page.locator('#destination').fill('Турция');
  await page.locator('#date-from').fill('2023-06-15');
  await page.locator('#date-to').fill('2023-06-25');
  await page.locator('#persons').selectOption('2');
  
  // Нажимаем кнопку "Найти"
  await page.locator('button[type="submit"]').click();
  
  // Ожидаем загрузки результатов
  await page.waitForSelector('.search-results');
  
  // Проверяем, что есть хотя бы один результат
  const results = page.locator('.tour-card');
  const count = await results.count();
  expect(count).toBeGreaterThan(0);
  
  // Проверяем, что в результатах есть туры в Турцию
  const firstTourTitle = await results.first().locator('.tour-title').textContent();
  expect(firstTourTitle?.toLowerCase()).toContain('турция');
});

// Тест страницы тура
test('Страница тура отображает детали и форму бронирования', async ({ page }) => {
  // Переходим сразу на страницу конкретного тура
  await page.goto('https://example-booking-service.com/tours/123');
  
  // Проверяем наличие основных элементов
  await expect(page.locator('.tour-title')).toBeVisible();
  await expect(page.locator('.tour-description')).toBeVisible();
  await expect(page.locator('.tour-price')).toBeVisible();
  await expect(page.locator('.booking-form')).toBeVisible();
  
  // Проверяем, что есть галерея фотографий
  const galleryItems = page.locator('.gallery-item');
  const count = await galleryItems.count();
  expect(count).toBeGreaterThanOrEqual(3);
});

// Тест процесса бронирования
test('Процесс бронирования работает корректно', async ({ page }) => {
  // Переходим сразу на страницу конкретного тура
  await page.goto('https://example-booking-service.com/tours/123');
  
  // Заполняем форму бронирования
  await page.locator('#booking-name').fill('Иван Иванов');
  await page.locator('#booking-email').fill('ivan@example.com');
  await page.locator('#booking-phone').fill('+7123456789');
  await page.locator('#booking-persons').selectOption('2');
  await page.locator('#booking-date').fill('2023-07-10');
  
  // Нажимаем кнопку "Забронировать"
  await page.locator('#booking-submit').click();
  
  // Ожидаем переход на страницу подтверждения
  await page.waitForURL(/\/booking\/confirmation/);
  
  // Проверяем, что есть номер бронирования
  const bookingNumber = page.locator('.booking-number');
  await expect(bookingNumber).toBeVisible();
  
  // Проверяем, что отображается правильное имя
  const customerInfo = page.locator('.customer-info');
  const customerInfoText = await customerInfo.textContent();
  expect(customerInfoText).toContain('Иван Иванов');
});

// Тест авторизации пользователя
test('Авторизация пользователя работает корректно', async ({ page }) => {
  await page.goto('https://example-booking-service.com/login');
  
  // Заполняем форму входа
  await page.locator('#email').fill('user@example.com');
  await page.locator('#password').fill('password123');
  
  // Нажимаем кнопку "Войти"
  await page.locator('button[type="submit"]').click();
  
  // Ожидаем переход в личный кабинет
  await page.waitForURL(/\/account/);
  
  // Проверяем, что личный кабинет загрузился
  const accountHeader = page.locator('.account-header');
  await expect(accountHeader).toBeVisible();
  
  // Проверяем, что отображается имя пользователя
  const userInfo = page.locator('.user-info');
  const userInfoText = await userInfo.textContent();
  expect(userInfoText).toContain('user@example.com');
});

// Тест просмотра истории бронирований в личном кабинете
test('История бронирований отображается в личном кабинете', async ({ page }) => {
  // Авторизуемся
  await page.goto('https://example-booking-service.com/login');
  await page.locator('#email').fill('user@example.com');
  await page.locator('#password').fill('password123');
  await page.locator('button[type="submit"]').click();
  
  // Переходим на страницу истории бронирований
  await page.goto('https://example-booking-service.com/account/bookings');
  
  // Проверяем, что есть таблица с историей
  const bookingsTable = page.locator('.bookings-table');
  await expect(bookingsTable).toBeVisible();
  
  // Проверяем, что в таблице есть записи
  const bookingRows = page.locator('.booking-row');
  const count = await bookingRows.count();
  expect(count).toBeGreaterThan(0);
});*/
