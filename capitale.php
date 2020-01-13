<?php
  $bdd = new mysqli('localhost', 'root', '', 'CC_PROG_INTERNET_2017_II_A');
  if ($bdd->connect_error) die("Erreur de connexion à la base de données");
  $bdd->set_charset("utf8");

  if (isset($_REQUEST['jouer'])) {
    $sql = "select cap_pays as pays, cap_nom as capitale from capitales where cap_id=" . rand(1,191);
    $rec = $bdd->query($sql) or die($bdd->error);
    echo(json_encode($rec->fetch_object()));
    exit();
  }

  if (isset($_REQUEST['recherche'])) {
    $critere = addslashes($_REQUEST['recherche']);
    $sql = "select * from capitales where cap_nom like '$critere%' or cap_pays like '$critere%' order by cap_pays";
    $rec = $bdd->query($sql) or die($bdd->error);
    header('Content-type: text/xml; charset=UTF-8');
    $xml = new XMLWriter();
    $xml->openMemory();
    $xml->startDocument('1.0', 'UTF-8');
    $xml->startElement('recherche_pays');
    while ($row=$rec->fetch_object()) {
       $xml->startElement('pays');
       $xml->writeAttribute('id', $row->cap_id);
       $xml->writeElement('nom', $row->cap_pays);
       $xml->writeElement('capitale', $row->cap_nom);
       $xml->writeElement('population', $row->cap_pop);
       $xml->endElement();
    }
    $xml->endElement();
    $xml->endDocument();
    echo $xml->outputMemory(TRUE);
  }
