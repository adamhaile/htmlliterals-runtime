interface Html {
	new (html : string) : HtmlShell;
	new (id : number, html : string) : HtmlShell;
	data(data : (v? : any) => any, event? : string) : HtmlMixin;
	focus(flag : Boolean, start? : number, end? : number) : HtmlMixin;
	onkey : {
		(key : string, callback : (key : KeyboardEvent) => void) : HtmlMixin;
		(key : string, event : string, callback : (key : KeyboardEvent) => void) : HtmlMixin;
	};
	class : {
		(name : string, flag : Boolean) : void;
		(name : string, alternate : string, flag : Boolean) : HtmlMixin;
	};
}

interface HtmlShell {
	node : HTMLElement;
	child(indices : Array<number>, fn : (children : Array<HtmlShell>) => void) : HtmlShell;
	property(setter : (node : HTMLElement) => void) : HtmlShell;
	insert(fn : () => any) : HtmlShell;
	mixin(mixin : HtmlMixin) : HtmlShell;
}

interface HtmlMixin {
	(node : HTMLElement) : any;
}

declare var Html : Html;