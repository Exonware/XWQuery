// Cap'n Proto Schema Example
@0x8523f4c8a1b2c3d4;

using Cxx = import "/capnp/c++.capnp";

struct Metadata {
  author @0 :Text;
  created @1 :Text;
  tags @2 :List(Text);
}

struct DatabaseConfig {
  host @0 :Text;
  port @1 :UInt16;
  name @2 :Text;
  ssl @3 :Bool;
}

struct Item {
  id @0 :UInt32;
  name @1 :Text;
  active @2 :Bool;
  price @3 :Float64;
  categories @4 :List(Text);
}

struct Document {
  name @0 :Text;
  version @1 :Text;
  description @2 :Text;
  metadata @3 :Metadata;
  database @4 :DatabaseConfig;
  items @5 :List(Item);
}

interface DocumentService {
  getDocument @0 (id :Text) -> (document :Document);
  createDocument @1 (document :Document) -> (id :Text);
  updateDocument @2 (id :Text, document :Document) -> ();
  deleteDocument @3 (id :Text) -> ();
}



