const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Permite acesso de qualquer origem
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

let createdSlugs = loadSlugs(); // Carrega os slugs do arquivo JSON

// Servir conteúdo estático para páginas
app.use('/:slug', (req, res, next) => {
  const slug = req.params.slug;
  const folderPath = path.join(__dirname, slug);

  // Serve o conteúdo estático se a pasta do slug existir
  if (fs.existsSync(folderPath)) {
    express.static(folderPath)(req, res, next);
  } else {
    next(); // Se não for um slug válido, passe para o próximo middleware
  }
});

app.post('/criarPagina', (req, res) => {
  const slug = req.body.pageSlug;
  const folderPath = `./${slug}`;

  if (fs.existsSync(folderPath)) {
    res.status(400).send('Essa página já existe.');
  } else {
    fs.mkdirSync(folderPath);

    const htmlContent = `<html lang="en">
      <!-- Seu HTML aqui -->
    </html>`;
    fs.writeFileSync(`${folderPath}/index.html`, htmlContent);

    // Adiciona o slug à lista de slugs criados
    createdSlugs.push(slug);
    saveSlugs(createdSlugs); // Salva os slugs no arquivo JSON

    res.redirect(`/${slug}`);
  }
});



app.put('/modificarTextoDoButton/:slug/:novoTexto', (req, res) => {
  const slug = req.params.slug;
  const novoTexto = decodeURIComponent(req.params.novoTexto);

  const folderPath = path.join(__dirname, slug);

  if (!fs.existsSync(folderPath)) {
    res.status(404).send('Essa página não existe.');
  } else {
    const indexPath = path.join(folderPath, 'index.html');

    // Lê o conteúdo do index.html
    fs.readFile(indexPath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Erro ao ler o arquivo.');
      } else {
        // Modifica o texto no HTML
        const novoConteudo = data.replace(/(<a class='link shake'[^<]+>)([^<]+)(<\/a>)/, `$1${novoTexto}$3`);

        // Escreve o conteúdo modificado de volta no arquivo
        fs.writeFile(indexPath, novoConteudo, (err) => {
          if (err) {
            res.status(500).send('Erro ao escrever o arquivo.');
          } else {
            res.send('Texto da âncora modificado com sucesso.');
          }
        });
      }
    });
  }
});





app.delete('/deletarPagina/:slug', (req, res) => {
  const slugToDelete = req.params.slug;
  const folderPath = `./${slugToDelete}`;

  if (!fs.existsSync(folderPath)) {
    res.status(404).send('Essa página não existe.');
  } else {
    fs.rmdirSync(folderPath, { recursive: true });

    // Remove o slug da lista de slugs criados
    createdSlugs = createdSlugs.filter(slug => slug !== slugToDelete);
    saveSlugs(createdSlugs); // Salva os slugs atualizados no arquivo JSON

    res.send('Página deletada com sucesso.');
  }
});



app.get('/modificarLink/:slug', (req, res) => {
  const slug = req.params.slug;
  const novoLink = req.query.novoLink;

  const folderPath = path.join(__dirname, slug);

  if (!fs.existsSync(folderPath)) {
    res.status(404).send('Essa página não existe.');
  } else {
    const indexPath = path.join(folderPath, 'index.html');

    // Lê o conteúdo do index.html
    fs.readFile(indexPath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Erro ao ler o arquivo.');
      } else {
        // Modifica o link no HTML
        const novoConteudo = data.replace(/<a class='link shake' href='[^']+'/g, `<a class='link shake' href='${novoLink}'`);

        // Escreve o conteúdo modificado de volta no arquivo
        fs.writeFile(indexPath, novoConteudo, (err) => {
          if (err) {
            res.status(500).send('Erro ao escrever o arquivo.');
          } else {
            res.send('Link modificado com sucesso.');
          }
        });
      }
    });
  }
});


app.put('/modificarTexto/:slug/:novoTexto', (req, res) => {
  const slug = req.params.slug;
  const novoTexto = decodeURIComponent(req.params.novoTexto);

  const folderPath = path.join(__dirname, slug);

  if (!fs.existsSync(folderPath)) {
    res.status(404).send('Essa página não existe.');
  } else {
    const indexPath = path.join(folderPath, 'index.html');

    // Lê o conteúdo do index.html
    fs.readFile(indexPath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Erro ao ler o arquivo.');
      } else {
        // Modifica o texto no HTML
        const novoConteudo = data.replace(/<p class='user-p'>[^<]+<\/p>/, `<p class='user-p'>${novoTexto}</p>`);

        // Escreve o conteúdo modificado de volta no arquivo
        fs.writeFile(indexPath, novoConteudo, (err) => {
          if (err) {
            res.status(500).send('Erro ao escrever o arquivo.');
          } else {
            res.send('Texto modificado com sucesso.');
          }
        });
      }
    });
  }
});

app.put('/modificarDescricao/:slug/:novaDescricao', (req, res) => {
  const slug = req.params.slug;
  const novaDescricao = decodeURIComponent(req.params.novaDescricao);

  const folderPath = path.join(__dirname, slug);

  if (!fs.existsSync(folderPath)) {
    res.status(404).send('Essa página não existe.');
  } else {
    const indexPath = path.join(folderPath, 'index.html');

    // Lê o conteúdo do index.html
    fs.readFile(indexPath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Erro ao ler o arquivo.');
      } else {
        // Modifica o texto no HTML
        const novoConteudo = data.replace(/<p class='center-p'>[^<]+<\/p>/, `<p class='center-p'>${novaDescricao}</p>`);

        // Escreve o conteúdo modificado de volta no arquivo
        fs.writeFile(indexPath, novoConteudo, (err) => {
          if (err) {
            res.status(500).send('Erro ao escrever o arquivo.');
          } else {
            res.send('Descricao modificado com sucesso.');
          }
        });
      }
    });
  }
});
   

app.get('/slugs', (req, res) => {
  res.json({ slugs: createdSlugs });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Servidor rodando na porta', PORT);
});

function loadSlugs() {
  try {
    const slugsData = fs.readFileSync('slugs.json');
    return JSON.parse(slugsData);
  } catch (error) {
    // Se o arquivo não existe ou ocorre algum erro, retorna um array vazio
    return [];
  }
}

function saveSlugs(slugs) {
  const data = JSON.stringify(slugs);
  fs.writeFileSync('slugs.json', data);
}
