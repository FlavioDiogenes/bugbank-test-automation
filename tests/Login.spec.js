const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://bugbank.netlify.app/';

// Testes automatizados baseados nos casos de teste documentados no plano de teste.
// Os testes validam o comportamento esperado da aplicação BugBank conforme os CTs definidos.

test.describe('Login - BugBank', () => {

  test('CT.01 - Login com dados válidos', async ({ page }) => {

    // Gera um e-mail único para evitar conflito com contas já cadastradas.
    const email = 'teste' + Date.now() + '@gmail.com';
    const senha = 'Teste123';

    await page.goto(BASE_URL);

    // Cria uma conta válida para garantir que o login seja realizado com um usuário existente.
    await page.getByRole('button', { name: 'Registrar' }).click();

    const cadastro = page.locator('.card__register');

    await cadastro.getByPlaceholder('Informe seu e-mail').fill(email);
    await cadastro.getByPlaceholder('Informe seu Nome').fill('Usuário Teste');
    await cadastro.getByPlaceholder('Informe sua senha').fill(senha);
    await cadastro.getByPlaceholder('Informe a confirmação da senha').fill(senha);

    await cadastro.getByRole('button', { name: 'Cadastrar' }).click();

    await expect(page.getByText(/criada com sucesso/i)).toBeVisible();

    await page.getByText('Fechar', { exact: true }).click();

    // Depois faz login com a conta criada
    const login = page.locator('.card__login');

    await login.getByPlaceholder('Informe seu e-mail').fill(email);
    await login.getByPlaceholder('Informe sua senha').fill(senha);
    await login.getByRole('button', { name: 'Acessar' }).click();

    await expect(page).toHaveURL(/home/);
  });


  test('CT.02 - Login com e-mail inválido', async ({ page }) => {
    await page.goto(BASE_URL);

    const login = page.locator('.card__login');

    // Preenche o campo de login com formato de email inválido
    await login.getByPlaceholder('Informe seu e-mail').fill('emailinvalido');
    await login.getByPlaceholder('Informe sua senha').fill('Teste123');
    await login.getByRole('button', { name: 'Acessar' }).click();

    await expect(page.getByText(/Formato inválido/i)).toBeVisible();
    await expect(page).not.toHaveURL(/home/);
  });

  test('CT.03 - Login com senha incorreta', async ({ page }) => {
    const email = 'teste' + Date.now() + '@gmail.com';
    const senha = 'Teste123';

    await page.goto(BASE_URL);

    // Primeiro cria uma conta válida
    await page.getByRole('button', { name: 'Registrar' }).click();

    const cadastro = page.locator('.card__register');

    await cadastro.getByPlaceholder('Informe seu e-mail').fill(email);
    await cadastro.getByPlaceholder('Informe seu Nome').fill('Usuário Teste');
    await cadastro.getByPlaceholder('Informe sua senha').fill(senha);
    await cadastro.getByPlaceholder('Informe a confirmação da senha').fill(senha);

    await cadastro.getByRole('button', { name: 'Cadastrar' }).click();

    await expect(page.getByText(/foi criada com sucesso/i)).toBeVisible();

    await page.getByText('Fechar', { exact: true }).click();

    //Depois insere uma senha incorreta
    const login = page.locator('.card__login');

    await login.getByPlaceholder('Informe seu e-mail').fill(email);
    await login.getByPlaceholder('Informe sua senha').fill('senhainvalida');
    await login.getByRole( 'button', { name: 'Acessar' }).click();

    await expect(page.getByText(/Usuário ou senha inválido/i)).toBeVisible();
    await expect(page).not.toHaveURL(/home/);
  });

  test('CT.04 - Login com campos vazios', async ({ page }) =>{
    await page.goto(BASE_URL);

    const login = page.locator('.card__login');

    await login.getByRole('button', { name: 'Acessar' }).click();

    await expect(login.getByText(/É campo obrigatório/)).toHaveCount(2);
    await expect(page).not.toHaveURL(/home/);

  });

  test('CT.05 - Login com espaços em branco', async ({ page }) =>{
    await page.goto(BASE_URL);
    const login = page.locator('.card__login');

    await login.getByPlaceholder('Informe seu e-mail').fill(' ');
    await login.getByPlaceholder('Informe sua senha').fill(' ');

    await login.getByRole('button', { name: 'Acessar' }).click();

    await expect(login.getByText(/É campo obrigatório/)).toHaveCount(2);
    await expect(page).not.toHaveURL(/home/);

  });

});

