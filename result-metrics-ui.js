(function () {
  'use strict';

  const metrics = window.ISMResultMetrics;
  const panel = document.querySelector('#resultMetricsSettings');
  if (!metrics || !panel) return;

  const button = panel.querySelector('button');
  const status = panel.querySelector('[role="status"]');
  function renderSettings() {
    button.textContent = metrics.participating() ? 'Não participar' : 'Participar';
    status.textContent = metrics.participating() ? 'Métricas locais ativadas.' : 'Métricas locais desligadas.';
  }
  renderSettings();
  button.addEventListener('click', () => {
    if (metrics.setParticipation(!metrics.participating())) renderSettings();
    else status.textContent = 'O navegador não conseguiu salvar sua escolha.';
  });
  window.addEventListener('pageshow', renderSettings);
  window.addEventListener('storage', renderSettings);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      metrics.visit();
      renderSettings();
    }
  });

  window.ISMResultMetricsFeedback = function (container) {
    const fieldset = document.createElement('fieldset');
    const question = document.createElement('legend');
    question.textContent = 'Foi fácil concluir sua primeira lição?';
    fieldset.append(question);
    const scale = document.createElement('p');
    scale.textContent = '1 = muito difícil · 5 = muito fácil';
    fieldset.append(scale);
    for (let value = 1; value <= 5; value += 1) {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'btn soft';
      option.textContent = String(value);
      option.setAttribute('aria-label', 'Nota ' + value + ' de 5');
      option.addEventListener('click', () => {
        const message = document.createElement('p');
        message.tabIndex = -1;
        message.textContent = metrics.rateEase(value) ? 'Obrigado pela sua resposta.' : 'A resposta não foi salva.';
        fieldset.replaceWith(message);
        message.focus();
      });
      fieldset.append(option);
    }
    const skip = document.createElement('button');
    skip.type = 'button';
    skip.className = 'btn soft';
    skip.textContent = 'Pular';
    skip.addEventListener('click', () => {
      const nextAction = container.querySelector('.complete-next');
      fieldset.remove();
      nextAction?.focus();
    });
    fieldset.append(skip);
    container.append(fieldset);
  };
})();
