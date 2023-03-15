<?php
  function jsonSwalDie($title, $html, $textButton = 'OK', $icon = 'success', $timer = false)
  {
    $settings = [
      'icon'              => $icon,
      'title'             => $title,
      'html'              => $html,
      'confirmButtonText' => $textButton,
    ];

    if ($timer) {
      $settings += [
        'timerProgressBar' => true,
        'timer'            => $timer,
        'showCloseButton'  => true
      ];
    }

    die(json_encode($settings));
  }
