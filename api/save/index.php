<?php
  require '../helpers/functions.php';
  if (isset($_POST['title']) && !empty($_POST['title']) && !empty($_POST['description'])) {
    $p = $_POST;


    jsonSwalDie(
      'OK!',
      'O conteúdo foi salvo com sucesso!!<br><h3 class="text-success">' . $_POST['title'].'</h3><small class="text-secondary">'.$_POST['description'].'</small>',
      'OK',
      'success',
      5000
    );
  }

  jsonSwalDie(
    'OOps!',
    'Preencha todos os campos.',
    'OK',
    'error',
  );