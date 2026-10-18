<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Universal Templates Path
    |--------------------------------------------------------------------------
    |
    | The authoritative root directory containing institutional template files
    | (DOCX templates, PDF reference guidelines, university sample formats).
    |
    */
    'templates_path' => env(
        'UNIREPORT_TEMPLATES_PATH',
        base_path('templates')
    ),

    /*
    |--------------------------------------------------------------------------
    | Supported Template Extensions
    |--------------------------------------------------------------------------
    |
    | Supported document formats for automated structure discovery and parsing.
    |
    */
    'supported_formats' => ['docx', 'pdf'],

    /*
    |--------------------------------------------------------------------------
    | Default Target Page Word Count
    |--------------------------------------------------------------------------
    */
    'words_per_page' => 350,
];
