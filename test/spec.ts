import * as fs from 'fs-extra';
import * as path from 'path';
import {
  Application,
  ArgumentsReader,
  ProjectReflection,
  TSConfigReader,
  TypeDocReader
} from 'typedoc';

describe(`FileTagsPlugin`, () => {
  const outDir = path.join(__dirname, 'out');

  let app: Application;
  let project: ProjectReflection;

  beforeAll(() => {
    fs.removeSync(outDir);
    app = new Application();
    app.options.addReader(new ArgumentsReader(0));
    app.options.addReader(new TypeDocReader());
    app.options.addReader(new TSConfigReader());
    app.options.addReader(new ArgumentsReader(300));

    app.bootstrap({
      entryPoints: [path.join(__dirname, 'src', 'index.ts')],
      plugin: [path.join(__dirname, '../dist/index')],
      tsconfig: path.join(__dirname, 'tsconfig.json')
    });

    project = app.convert();
  });

  afterAll(() => {
    // fs.removeSync(outDir);
  });

  /**
   * Run Typedoc on some source files and just generate the HTML output for inspection.
   */
  describe(`Output HTML`, () => {
    test('HTML index exists', async () => {
      await app.generateDocs(project, outDir);
      expect(fs.existsSync(`${outDir}/modules.html`)).toBeTruthy();
      const modulesFile = fs.readFileSync(`${outDir}/modules.html`, "utf8");
      expect(modulesFile).toContain("Functions Grammar");
      expect(modulesFile).toContain("Functions Math");
      expect(modulesFile).toContain("Functions SuperMath");
    });
  });
  
});
