
.ts（代码实现文件） .d.ts(类型声明文件)

test.ts 
  用export：声明会模块化，
  不用export时会所有的声明会放在全局（不推荐）

export namespace HomeItems {  //这里相当于一个ts文件，所以内部要export导出，--命名空间
   export interface Iitem{
      x: number;
   }
   export interface Iitem2{
      x: string;
   }
}


test.d.ts 
  用declare namespace/ namespace 所有的声明都会放在全局 
  不能同时用export 不然找不到声明，可能是因为 .d.ts(是类型声明文件)

注：不应该对模块使用命名空间


所以最好在.ts中用export 在.d.ts中只用declare
.ts 文件：用于编写 TypeScript 代码，可以包含变量、函数、类等实际的 TypeScript 代码，并且可以使用 export 关键字将这些内容导出，供其他模块导入和使用。
.d.ts 文件：用于描述 JavaScript 中已存在的类型信息，或者描述在 TypeScript 中定义但在运行时由其他库提供的类型信息。在 .d.ts 文件中，应该只使用 declare 关键字来声明类型信息，不需要使用 export 关键字导出这些声明。这样做可以确保 TypeScript 编译器在类型检查时能够正确地识别和使用这些声明，但同时避免将这些声明编译到最终的 JavaScript 输出文件中。