import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../../fixtures/ui';

// Automated checks catch only part of the WCAG issues; this is a guard, not a full audit.
// Only critical and serious findings fail the test, so the list below stays readable.
test('product page has no critical or serious accessibility violations', async ({
  page,
  inventoryPage,
}) => {
  await inventoryPage.goto();
  await expect(inventoryPage.items.first()).toBeVisible();

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const blocking = results.violations
    .filter((v) => v.impact === 'critical' || v.impact === 'serious')
    .map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s)`);

  expect(blocking, blocking.join('\n')).toEqual([]);
});
