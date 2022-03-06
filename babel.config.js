module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',  // 可选链运算符 ?.
    '@babel/plugin-proposal-nullish-coalescing-operator'  // 空值合并运算符 ??
  ]
}
