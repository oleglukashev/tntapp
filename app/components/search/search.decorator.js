config.$inject = ['$provide'];

export default function config($provide) {
  // add additional function to md-autocomplete
  $provide.decorator('mdAutocompleteDirective', mdAutoCompleteDirectiveOverride);

  mdAutoCompleteDirectiveOverride.$inject = ['$delegate'];

  function mdAutoCompleteDirectiveOverride($delegate) {
    const directive = $delegate[0];
    // need to append to base compile function
    const compile = directive.compile;

    // add our custom attribute to the directive's scope
    angular.extend(directive.scope, {
      menuContainerClass: '@?mdMenuContainerClass'
    });

    // recompile directive and add our class to the virtual repeat container
    directive.compile = function(element, attr) {
      const template = compile.apply(this, arguments);
      const menuContainerClass = attr.mdMenuContainerClass ? attr.mdMenuContainerClass : '';
      const menuContainer = element.find('md-virtual-repeat-container');

      menuContainer.addClass(menuContainerClass);

      // recompile the template
      return function(e, a) {
        template.apply(this, arguments);
      };
    };

    return $delegate;
  }
}