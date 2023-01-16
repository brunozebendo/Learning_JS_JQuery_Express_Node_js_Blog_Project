/*O objetivo do projeto é criar uma página com links href para outras páginas
e com textos com a opção read more, assim como criar e postar seus próprios posts.
Algo como o blogger.
Normalmente, é feita toda a instalação dos módulos NPM, mas quando o projeto é baixado
diretamente do GITHUB, normalmente, as requisições mínimas necessárias estão no
package.json e se dando o comando mpn install ele já instala os módulos necessários.
Aqui foram iniciadas as bibliotecas, express, framework básico de utilização do
Node.js, o bodyparser para lidar com o html, ejs, que é o próprio Node.js,
e o lodash que pelo que entendi é uma biblioteca com várias funcionalidades,
como a .lowercase, aqui utilizada*/

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
/*aqui são as variáveis constantes que, na verdade, serão o texto constante em cada
página, que Normalmente iria em um html, mas como é um site pequeno, ela lançou
aqui mesmo. Notar que a variável é passada dentro do app.get, falando que
essa constante é recebida no parágrado da home.ejs através do código
  <p> <%= startingContent %> </p>. Notar também que não há página html, apenas
  ejs*/
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
/*aqui foi criada um array vazio para guardar os novos postos criados pelos usuários,
ele foi criado como let e aqui no começo para que seja uma variável de escopo global,
que pode ser acessado por todas as funções do código*/
let posts = [];
/*aqui o código padrão para a rota home, passando dentro das chaves o valor que
se quer que seja publicado, nesse caso, a variável no código ejs que equivale
a variável aqui instanciada, é uma relação key: value, reparar a sintaxe dos dois pontos.*/
app.get("/", function(req, res){
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts
    });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});
/*o código get acima vai lidar com o desvio de rota para a página compose,
onde serão escritos os novos blogs dos usuários, já o app.post abaixo vai lidar
com os novos posts, para isso é criada uma variável post que vai receber a informação
do título do post que corresponde ao campo de nome postTitle, que está dentro
do body e aqui foi requisitada, a mesma coisa com o conteúdo (conteúdo). Abaixo,
o método posts.push(post) vai "empurrar" mais um post para dentro do array
posts e o método redirect vai redirecionar a função para a home route, ou seja,
após o usuário publicar o post, ele vai ser acrescentado na página principal */
app.post("/compose", function(req, res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  posts.push(post);

  res.redirect("/");

});
/*O código abaixo usa uma feature do express chamada Express Routing Parameters,
o que ela faz é atribuir dinâmicamente uma rota para o parâmetro determinado,
nessa caso :postName é necessário os :  Também é preciso usar a sintaxe req.params.nomedaparâmetro
A ideia do código é criar automaticamente uma nova rota toda vez que for postado
algo novo, para isso, primeiro, ao req.params.postName foi atribuído o método
para transformar em minúsculo, e depois passado para a variável requestedTitle.
então, o array posts, que armazena os posts já feitos, usa o método forEach para
encontrar o título de cada novo post se (if) ele for igual a algum título já guardado
A ideia é que se o usuário digitar /post/onomedealgumpost, seja renderizado e ele
seja levado para a página adequada. Existe uma página post.ejs só pra isso*/
app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
