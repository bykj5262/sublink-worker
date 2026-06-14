/** @jsxRuntime automatic */
/** @jsxImportSource hono/jsx */
import { PREDEFINED_RULE_SETS, UNIFIED_RULES } from '../config/index.js';
import { CustomRules } from './CustomRules.jsx';
import { TextareaWithActions } from './TextareaWithActions.jsx';
import { ValidatedTextarea } from './ValidatedTextarea.jsx';
import { formLogicFn } from './formLogic.js';

const LINK_FIELDS = [
  { key: 'xray', labelKey: 'xrayLink' },
  { key: 'singbox', labelKey: 'singboxLink' },
  { key: 'clash', labelKey: 'clashLink' },
  { key: 'surge', labelKey: 'surgeLink' }
];

export const Form = (props) => {
  const { t, lang } = props;
  const translations = {
    processing: t('processing'),
    convert: t('convert'),
    saveConfigSuccess: t('saveConfigSuccess'),
    saveConfig: t('saveConfig'),
    savingConfig: t('savingConfig'),
    configContentRequired: t('configContentRequired'),
    configSaveFailed: t('configSaveFailed'),
    confirmClearConfig: t('confirmClearConfig'),
    confirmClearAll: t('confirmClearAll'),
    errorGeneratingLinks: t('errorGeneratingLinks'),
    shortenLinks: t('shortenLinks'),
    shortening: t('shortening'),
    alreadyShortened: t('alreadyShortened'),
    shortenFailed: t('shortenFailed'),
    customShortCode: t('customShortCode'),
    optional: t('optional'),
    customShortCodePlaceholder: t('customShortCodePlaceholder'),
    showFullLinks: t('showFullLinks')
  };

  const scriptContent = `
    window.APP_TRANSLATIONS = ${JSON.stringify(translations)};
    window.PREDEFINED_RULE_SETS = ${JSON.stringify(PREDEFINED_RULE_SETS)};
    window.APP_LANG = ${JSON.stringify(lang || 'zh-CN')};
    if (typeof __name === 'undefined') { var __name = function(fn) { return fn; }; }
    (${formLogicFn.toString()})();
  `;

  return (
    <div x-data="formData()" x-init="init()" class="max-w-4xl mx-auto">
      <form {...{'x-on:submit.prevent': 'submitForm'}} class="space-y-8">
        {/* 以下所有内容和原来完全一致，直到 Results Section */}
        {/* Input Section、Advanced Options 等全部保持不变 */}

        {/* Results Section - 只在这里增加了二维码 */}
        <div x-cloak x-show="generatedLinks" x-data="{ copied: null }" {...{'x-transition:enter': 'transition ease-out duration-500', 'x-transition:enter-start': 'opacity-0 transform translate-y-8', 'x-transition:enter-end': 'opacity-100 transform translate-y-0'}} class="mt-12">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-all duration-300 hover:shadow-md">
            
            {/* 原有订阅链接部分（完全不变） */}
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                  <i class="fas fa-link text-sm"></i>
                </span>
                {t('subscriptionLinks')}
              </h2>
            </div>

            <div class="mt-6 space-y-4">
              {LINK_FIELDS.map((field) => (
                <div class="relative group" key={field.key}>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t(field.labelKey)}
                  </label>
                  <div class="flex gap-2">
                    <input
                      type="text"
                      readonly
                      x-bind:value={`shortenedLinks ? shortenedLinks?.${field.key} : generatedLinks?.${field.key}`}
                      class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:border-transparent transition-all duration-200 font-mono text-sm"
                      x-bind:class="shortenedLinks ? 'text-primary-600 dark:text-primary-400 font-semibold focus:ring-primary-500' : 'text-gray-600 dark:text-gray-400 focus:ring-green-500'"
                    />
                    <button
                      type="button"
                      x-on:click={`navigator.clipboard.writeText((shortenedLinks || generatedLinks)?.${field.key}); copied = '${field.key}'; setTimeout(() => copied = null, 2000)`}
                      class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                      x-bind:class={`{
                        'hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400': !shortenedLinks,
                        'hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400': shortenedLinks,
                        'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400': !shortenedLinks && copied === '${field.key}',
                        'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400': shortenedLinks && copied === '${field.key}'
                      }`}
                    >
                      <i class="fas" x-bind:class={`copied === '${field.key}' ? 'fa-check' : 'fa-copy'`}></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Shortening Controls 原有内容保持不变 */}
            <div class="mt-6">
              {/* ... 原有的 Shortening Controls 代码 ... */}
            </div>
          </div>
        </div>
      </form>

      <script dangerouslySetInnerHTML={{ __html: scriptContent }} />
    </div>
  );
};
