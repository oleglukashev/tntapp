export default function scrollMore() {
  return {
    restricted: 'A',
    link: (scope, element, attrs) => {
      window.addEventListener('scroll', () => {
        // Call given callback if scrollbar has reached bottom of the page
        // Usage: `<div scroll-more="loadSomethingPieceByPiece()">...</div>`

        if (window.innerHeight + Math.ceil(window.pageYOffset + 1) >= document.body.offsetHeight) {
          scope.$apply(attrs.scrollMore);
        }
      });
    },
  };
}
