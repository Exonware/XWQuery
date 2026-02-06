module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('xwui');
  eleventyConfig.addPassthroughCopy('xwui-button.mjs');
  eleventyConfig.addPassthroughCopy('xwui-theme-examples.css');
  eleventyConfig.addPassthroughCopy('uber');
  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: 'layouts',
    },
  };
};
