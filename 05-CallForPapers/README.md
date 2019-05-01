# 05 - Call for Papers [easy]

> Please read and review my CFP document, for the upcoming IAPLI Symposium.
> 
> I didn't write it myself, but used some artificial intelligence.
> 
> What do you think about it?
> 
> [IAPLI_Conference.docx](IAPLI_Conference.docx)

Opening the .docx document in WordPad (I apparently did not have Word
installed) shows us a text that looks like random spam for a conference.
There apperas to be no images, at least not that WordPad can render.

Since .docx is actually just a .zip in disguise we can unzip the file to
have a closer look at its contents. See [./IAPLI_Conference](./IAPLI_Conference).
Sadly, no hidden files appear in the unziped version. It's just a bunch of
fairly boring .xml files.

Perhaps then the image is hidden in a section of the .zip that is not
referenced in the [Zip Central Directory](https://en.wikipedia.org/wiki/Zip_(file_format)#Structure)?
This seems unlikely given that the file size is only about 15KB. Indeed,
a quick manual inspection using HxD later we can be fairly sure that there
is nothing hidden in the IAPLI_Conference.docx file that was not extracted.

Instead we have to turn back to the extracted .xml files. After a bit of
poking around, we spot something that looks slightly odd in the 
[docProps/core.xml](./IAPLI_Conference/docProps/core.xml) file.
Namely that the The `dc:creator` property is `"SCIpher"`:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
    xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/"
    xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <dc:title>The Third IAPLI Symposium on ubiquitous multimedia</dc:title>
    <dc:subject></dc:subject>
    <dc:creator>SCIpher</dc:creator>
    <cp:keywords></cp:keywords>
    <dc:description></dc:description>
    <cp:lastModifiedBy>Philipp Sieber</cp:lastModifiedBy>
    <cp:revision>5</cp:revision>
    <dcterms:created xsi:type="dcterms:W3CDTF">2019-01-12T20:42:00Z</dcterms:created>
    <dcterms:modified xsi:type="dcterms:W3CDTF">2019-04-05T11:38:00Z</dcterms:modified>
</cp:coreProperties>
```

This could of course be nothing more than a considence, but given that we are
looking for something that is probably a Cipher, SCIpher is perhaps more than
just slightly odd. Turning to Google we find exactly what we were hoping for:

> SCIpher is a program that can hide text messages within seemingly innocuous scientific conference advertisements.  
-- https://pdos.csail.mit.edu/archive/scigen/scipher.html


Even better, the website has a decrypt box ready for us to use. Copy pasting
the entire document and hitting Decode results in the following decoded
message:

> https://hackyeaster.hacking-lab.com/hackyeaster/images/eggs/5e171aa074f390965a12fdc240.png

And indeed, that is the egg for this level:

![https://hackyeaster.hacking-lab.com/hackyeaster/images/eggs/5e171aa074f390965a12fdc240.png](https://hackyeaster.hacking-lab.com/hackyeaster/images/eggs/5e171aa074f390965a12fdc240.png)
