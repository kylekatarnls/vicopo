# [VICOPO](https://vicopo.selfbuild.fr/)

#### API HTTP et Script pour trouver les villes à partir d'un code postal et code postaux à partir d'une ville

Vicopo est un moyen léger et rapide rechercher une ville française et implémenter des propositions à la volée, l'autocomplétion d'un champ de ville ou de code postal et la conversion de l'un vers l'autre.

https://vicopo.selfbuild.fr/

## Utilisation

### Afficher les villes possibles dans une liste

```html
<input id="ville" placeholder="Entrez un code postal ou une ville" autocomplete="off" size="50">
<ul>
  <li data-vicopo="#ville">
    <strong data-vicopo-code-postal></strong>
    <span data-vicopo-ville></span>
  </li>
</ul>
```
[Voir la démonstration](https://jsfiddle.net/KyleKatarn/y27x72ka/6/)

Ajoutez l'attribut data-vicopo à un élément et passez-lui en paramètre un sélecteur qui pointera vers un champ(`<input>`, `<select>` ou `<textarea>`). Quand la valeur du champs change, l'élément sera duppliqué autant de fois qu'il y a de villes commençant par la valeur tapée ou dont le code postal commence par la valeur tapée (la recherche commence à partir de 2 caractères tapés).

À l'intérieur de ces éléments, les balises portant les attributs `data-vicopo-code-postal`, `data-vicopo-ville` seront respectivement pourvus du code postal et de la ville. Si ces balises sont des champs, utilisez `data-vicopo-val-code-postal` et `data-vicopo-val-ville` pour que les informations soient assignées en tant que valeur.

## Compléter le champ avec le premier nom de ville trouvé

```js
$('#ville').keyup(function (e) {
  if(e.keyCode == 13) {
    var $ville = $(this);
    $.vicopo($ville.val(), function (input, cities) {
      if(input == $ville.val() && cities[0]) {
        $ville.val(cities[0].city).vicopoTargets().vicopoClean();
      }
    });
    e.preventDefault();
    e.stopPropagation();
  }
});
```
[Voir la démonstration](https://jsfiddle.net/KyleKatarn/48uuL3v5/3/)

Lors de l'appui sur `Entrée`, on récupère la première ville et on l'applique comme nouvelle valeur du champ.

L'ajout optionnel de `.vicopoTargets().vicopoClean()` permet d'effacer la liste de suggestions.

## Récupérer les villes au fur et à mesure de la saisie

```js
$('#recherche').vicopo(function (cities) {
  if(cities.length) {
    $('#ville').val(cities[0].city);
    $('#code').val(cities[0].code);
  } else {
    $('#ville').val('');
    $('#code').val('');
  }
  $('#count').val(cities.length + ' villes trouvées');
});
```
Les méthodes `.vicopo()`, `.codePostal()` et `.ville()` appliquées à un élément jQuery permettent de récupérer dans une variable le résultat de la recherche à chaque lettre saisie dans le champ.

## Utilisation sans champs de saisie

```js
$('#cp').click(function () {
  $.ville('strasbourg', function (input, cities) {
    $('#cp-result').text(cities[0].code);
  });
});
$('#villes').click(function () {
  $.ville('des', function (input, cities) {
    $('#villes-result').text(cities.map(function (entry) {
      return entry.city;
    }).join(', '));
  });
});
```
[Voir la démonstration](https://jsfiddle.net/KyleKatarn/ny8k9ya6/6/)

Les méthodes `$.vicopo()`, `$.codePostal()` et `$.ville()` prennent en premier paramètre le code postal ou la ville (partiel ou entier) recherché et en second paramètre une fonction de callback appelée avec le terme recherché en premier paramètre, les villes trouvées en second et en troisième 'code' pour une recherche de code postal ou 'city' pour une recherche de ville.

## API HTTP brute au fomart JSON (par défaut)

| Protocole | URL                                                   |
|-----------|-------------------------------------------------------|
| HTTP      | http://vicopo.selfbuild.fr/cherche/680                |
| HTTPS     | https://vicopo.selfbuild.fr/cherche/680               |
```json
{
	"input": "680",
	"cities": [
		{
			"code": 68040,
			"city": "INGERSHEIM"
		},
		{
			"code": 68000,
			"city": "COLMAR"
		}
	]
}
```

## Plugin node.js

Vicopo est disponible sous node.js directement via require('vicopo') :

```javascript
var ville = 'Lille';
var vicopo = require('vicopo')('http');
vicopo(ville, function (err, cities) {
    if (err) {
        throw err;
    } else {
        console.log(cities);
    }
});
```

Plus d'options sur https://vicopo.selfbuild.fr/
