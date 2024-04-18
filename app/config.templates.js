export default function templates($templateCache) {
  'ngInject';

  // $templateCache.removeAll();
  $templateCache.put('page_filter_time_ranges.view.html', require('./shared/page_filter/time_ranges/page_filter_time_ranges.view.html'));
  $templateCache.put('rzSliderTpl.html', require('./shared/rz-slider/rz-slider.view.html'));
  $templateCache.put('reservation_print.view.html', require('./shared/reservation_print/reservation_print.view.html'));
  $templateCache.put('agenda_charts.view.html', require('./components/agenda/charts/agenda_charts.view.html'));
  $templateCache.put('agenda.widget.html', require('./components/agenda/agenda.widget.html'));
  $templateCache.put('search.print.view.html', require('./components/search/search.print.view.html'));

  $templateCache.put('page_filter.date.view.html', require('./shared/page_filter/page_filter.date.view.html'));
  $templateCache.put('page_filter.daterange.view.html', require('./shared/page_filter/page_filter.daterange.view.html'));
  $templateCache.put('page_filter.print.view.html', require('./shared/page_filter/page_filter.print.view.html'));
  $templateCache.put('page_filter.change_view.view.html', require('./shared/page_filter/page_filter.change_view.view.html'));
  $templateCache.put('page_filter.settings.view.html', require('./shared/page_filter/page_filter.settings.view.html'));
  $templateCache.put('page_filter.profile_settings.view.html', require('./shared/page_filter/page_filter.profile_settings.view.html'));
  $templateCache.put('page_filter.search_settings.view.html', require('./shared/page_filter/page_filter.search_settings.view.html'));
  $templateCache.put('page_filter.filter.view.html', require('./shared/page_filter/page_filter.filter.view.html'));
  $templateCache.put('page_filter.lead.filter.view.html', require('./shared/page_filter/page_filter.lead.filter.view.html'));
  $templateCache.put('page_filter.sort.view.html', require('./shared/page_filter/page_filter.sort.view.html'));
}
