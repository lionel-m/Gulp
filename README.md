# Gulp
Personal Gulp workflow

## How to use it

Run `gulp --dev` during the development phase or `gulp` for production (concatenate and minify JS and CSS files).

Run `gulp lint` tests your JS and CSS files.

Run `generate:font` automatically generates @font-face rules

Example:

```CSS
body {
   font-family: "Alice";
}
```

Return

```CSS
@font-face {
   font-family: "Alice";
   font-style: normal;
   font-weight: 400;
   src: local("Alice"), local("Alice-Regular"),
        url("http://fonts.gstatic.com/s/alice/v7/sZyKh5NKrCk1xkCk_F1S8A.eot?#") format("eot"),
        url("http://fonts.gstatic.com/s/alice/v7/l5RFQT5MQiajQkFxjDLySg.woff2") format("woff2"),
        url("http://fonts.gstatic.com/s/alice/v7/_H4kMcdhHr0B8RDaQcqpTA.woff")  format("woff"),
        url("http://fonts.gstatic.com/s/alice/v7/acf9XsUhgp1k2j79ATk2cw.ttf")   format("truetype")
}

body {
  font-family: "Alice";
}
```

Run `stylefmt` formats CSS according to stylelint rules
