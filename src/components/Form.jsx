/** @jsxRuntime automatic */
/** @jsxImportSource hono/jsx */
import { PREDEFINED_RULE_SETS, UNIFIED_RULES } from '../config/index.js';
import { CustomRules } from './CustomRules.jsx';
import { TextareaWithActions } from './TextareaWithActions.jsx';
import { ValidatedTextarea } from './ValidatedTextarea.jsx';
import { formLogicFn } from './formLogic.js';
import QRCodeSVG from 'qrcode-svg';

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
        
        {/* 你的原代码从这里开始保持不变，直到 Results Section 的订阅链接部分 */}
        {/* 请把你原来的 Input Section、Advanced Options、Action Buttons 等内容粘贴在这里 */}

        {/* Results Section */}
        <div x-cloak x-show="generatedLinks" class="mt-12">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">

            {/* 原有订阅链接显示部分（保持你原来的） */}
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
                    />
                    <button type="button" 
                      x-on:click={`navigator.clipboard.writeText((shortenedLinks || generatedLinks)?.${field.key})`}
                      class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">
                      <i class="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 二维码 - 只显示 Clash（最稳妥） */}
            <div class="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                <i class="fas fa-qrcode"></i>
                扫码订阅（Clash）
              </h3>
              <div class="flex justify-center">
                {(shortenedLinks || generatedLinks)?.clash && (
                  <div class="bg-white p-5 rounded-2xl shadow">
                    <div dangerouslySetInnerHTML={{
                      __html: new QRCodeSVG({
                        content: (shortenedLinks || generatedLinks).clash,
                        width: 240,
                        height: 240,
                        padding: 4
                      }).svg()
                    }} />
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </form>
      <script dangerouslySetInnerHTML={{ __html: scriptContent }} />
    </div>
  );
};
