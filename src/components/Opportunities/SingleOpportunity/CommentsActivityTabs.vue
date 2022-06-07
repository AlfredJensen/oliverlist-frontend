<template>
  <ul class="nav nav-pills tbOliver activity pt-3 pr-4 pl-4" id="pills-tab-notes" role="tablist">
    <li class="nav-item pr-0">
      <a
        class="nav-link active text-primary"
        id="pills-comments"
        data-toggle="pill"
        href="#pill-comments"
        role="tab"
        aria-controls="pill-comments"
        aria-selected="true"
      >
        <div class="titCard">
          <h4 class="d-inline m-0"><i class="icon-pencil"></i> {{ $t('lang.label.notes') }}</h4>
        </div>
      </a>
    </li>
    <li class="nav-item pr-0">
      <a
        class="nav-link text-primary"
        id="pills-emails"
        data-toggle="pill"
        href="#pill-emails"
        role="tab"
        aria-controls="pill-emails"
        aria-selected="true"
      >
        <div class="titCard">
          <h4 class="d-inline m-0"><i class="icon-mail"></i> {{ $t('lang.button.answerviaoliver') }}</h4>
        </div>
      </a>
    </li>
    <li class="nav-item pr-0">
      <a
        class="nav-link text-primary"
        id="pills-activity"
        data-toggle="pill"
        href="#pill-activity"
        role="tab"
        aria-controls="pill-activity"
        aria-selected="true"
      >
        <div class="titCard">
          <h4 class="d-inline m-0"><i class="icon-clock"></i> {{ $t('lang.opportunities.reminder') }}</h4>
        </div>
      </a>
    </li>
  </ul>
</template>

<script>
export default {};
</script>