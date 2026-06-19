const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://bugbank.netlify.app/';

// Testes automatizados baseados nos casos de teste documentados no plano de teste.
// Os testes validam o comportamento esperado da aplicação BugBank conforme os CTs definidos.

test.describe('Cadastro - BugBank', () => {
    test('CT.06 - Cadastro com dados válidos', async ({ page }) => {
        await page.goto(BASE_URL);

        await page.getByRole('button', { name: 'Registrar' }).click();
        
        const cadastro = page.locator('.card__register');

        const email = 'teste' + Date.now() + '@gmail.com';
        const senha = 'Teste123';

        // Preenche o formulário com dados válidos
        await cadastro.getByPlaceholder('Informe seu e-mail').fill(email);
        await cadastro.getByPlaceholder('Informe seu Nome').fill('Usuário Teste');
        await cadastro.getByPlaceholder('Informe sua senha').fill(senha);
        await cadastro.getByPlaceholder('Informe a confirmação da senha').fill(senha);

        await cadastro.getByRole('button', { name: 'Cadastrar' }).click();

        // Depois confere se a conta foi criada com sucesso
        await expect(page.getByText(/criada com sucesso/i)).toBeVisible();
        await page.getByText('Fechar', { exact: true }).click();
        await expect(page.locator('.card__login')).toBeVisible();
    });

    test('CT.07 - Cadastro com e-mail inválido', async ({ page }) => {
        await page.goto(BASE_URL);

        await page.getByRole('button', { name: 'Registrar' }).click();
        
        const cadastro = page.locator('.card__register');

        const senha = 'Teste123';

        // Cadastra um usuário com email de formato inválido
        await cadastro.getByPlaceholder('Informe seu e-mail').fill('emailinvalido');
        await cadastro.getByPlaceholder('Informe seu Nome').fill('Usuário Teste');
        await cadastro.getByPlaceholder('Informe sua senha').fill(senha);
        await cadastro.getByPlaceholder('Informe a confirmação da senha').fill(senha);

        await cadastro.getByRole('button', { name: 'Cadastrar' }).click();

        await expect(cadastro.getByText(/Formato inválido/i)).toBeVisible();
        await expect(page.getByText(/criada com sucesso/i)).not.toBeVisible();

    });
    test('CT.08 - Cadastro com senha fraca', async ({ page }) =>{
        await page.goto(BASE_URL);

        await page.getByRole('button', { name: 'Registrar' }).click();

        const cadastro = page.locator('.card__register');

        const email = 'teste' + Date.now() + '@gmail.com';
        const senhaFraca = 'senha123';

        // Cadastra um usuário com senha simples
        await cadastro.getByPlaceholder('Informe seu e-mail').fill(email);
        await cadastro.getByPlaceholder('Informe seu Nome').fill('Usuário Teste');
        await cadastro.getByPlaceholder('Informe sua senha').fill(senhaFraca);
        await cadastro.getByPlaceholder('Informe a confirmação da senha').fill(senhaFraca);

        await cadastro.getByRole('button', { name: 'Cadastrar' }).click();

        await expect(page.getByText(/criada com sucesso/i)).not.toBeVisible();
        await expect(page.getByText(/senha fraca|senha é fraca|senha inválida/i)).toBeVisible();

        // O resultado esperado do CT.08 é impedir o cadastro com senha fraca.
        // Caso a conta seja criada, o teste falha e evidencia o bug documentado no relatório.

    });
    test('CT.09 - Cadastro com campos vazios', async ({ page }) => {
        await page.goto(BASE_URL);

        await page.getByRole('button', { name: 'Registrar' }).click();

        const cadastro = page.locator('.card__register');

        await cadastro.getByRole('button', { name: 'Cadastrar' }).click();

        await expect(cadastro.getByText(/É campo obrigatório/i)).toHaveCount(4);
        await expect(page.getByText(/criada com sucesso/i)).not.toBeVisible();
    });
    
    test('CT.10 - Cadastro com usuário já existente', async ({ page }) => {
        await page.goto(BASE_URL);

        await page.getByRole('button', { name: 'Registrar' }).click();
        
        const cadastro = page.locator('.card__register');

        const email = 'teste' + Date.now() + '@gmail.com';
        const senha = 'Teste123';
        const usuario = 'Usuário Teste';

        // Primeiro cadastra um usuário
        await cadastro.getByPlaceholder('Informe seu e-mail').fill(email);
        await cadastro.getByPlaceholder('Informe seu Nome').fill(usuario);
        await cadastro.getByPlaceholder('Informe sua senha').fill(senha);
        await cadastro.getByPlaceholder('Informe a confirmação da senha').fill(senha);
        
        await cadastro.getByRole('button', { name: 'Cadastrar' }).click();

        await expect(page.getByText(/criada com sucesso/i)).toBeVisible();
        await page.getByText('Fechar', { exact: true }).click();


        await page.getByRole('button', { name: 'Registrar' }).click();

        // Depois tenta cadastrar o mesmo usuário novamente
        await cadastro.getByPlaceholder('Informe seu e-mail').fill(email);
        await cadastro.getByPlaceholder('Informe seu Nome').fill(usuario);
        await cadastro.getByPlaceholder('Informe sua senha').fill(senha);
        await cadastro.getByPlaceholder('Informe a confirmação da senha').fill(senha);

        await cadastro.getByRole('button', { name: 'Cadastrar' }).click();

        await expect(page.getByText(/usuário já existente|usuário já cadastrado|email já existe|e-mail já cadastrado|email já foi cadastrado/i)).toBeVisible();
        await expect(page.getByText(/criada com sucesso/i)).not.toBeVisible();

        // O resultado esperado do CT.10 é impedir cadastro com e-mail já existente.
        // Caso uma nova conta seja criada, o teste falha e evidencia o bug documentado no relatório.
    });
});