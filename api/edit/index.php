<?php

  if (isset($_POST['id'])) {
    require '../helpers/functions.php';
    $p = $_POST;

    $header = '<h3 class="fw-normal">Edit Album # ' . $p['id'] . '</h3>';

    $body = '<div class="row">'
      . '<div class="col-md-6">'
      . '<label>Title</label>'
      . '<input type="text" name="title" class="form-control">'
      . '</div>'
      . '<div class="col-md-6">'
      . '<label>Description</label>'
      . '<input type="text" name="description" class="form-control">'
      . '</div>'
      . '</div>';

    die(json_encode([
      'header' => $header,
      'body'   => $body,
    ]));
  }