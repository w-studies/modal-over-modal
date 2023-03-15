<?php
  if (isset($_POST['id'])) {
    require '../helpers/functions.php';
    $p = $_POST;

    $header = '<h3 class="fw-normal">Album # ' . $p['id'] . '</h3>';

    $body = '<table class="table table-striped">'

      . '<thead>'
      . '<tr>'
      . '<th>code</th>'
      . '<th>title</th>'
      . '<th>description</th>'
      . '<th width="10">actions</th>'
      . '</tr>'
      . '</thead>'

      . '<tbody>'
      . '<tr>'
      . '<td>' . $p['id'] . '</td>'
      . '<td>Title</td>'
      . '<td>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci animi at deleniti quibusdam? Accusamus, cupiditate enim excepturi id nostrum provident, quasi qui recusandae rerum suscipit tempore temporibus, ullam voluptate voluptatem.</td>'
      . '<td><a href="edit/' . $p['id'] . '" class="btn btn-link">superModal</a></td>'
      . '</tr>'
      . '</tbody>'

      . '</table>';

    $footer = null;

    if ($p['id'] === '1234abcdefghijk') {
      jsonSwalDie(
        'Oops!',
        'Registro não encontrado!',
        'Entendi!',
        'error',
      );
    }

    die(json_encode([
      'header' => $header,
      'body'   => $body,
      'footer' => $footer
    ]));
  }